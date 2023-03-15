import { ERC20_TRANSFER_EVENT_HASH } from '@app/notifications-service/common/constants/events'
import { TokenType } from '@app/notifications-service/common/constants/token-types'
import { logPerformance } from '@app/notifications-service/common/decorators/log-performance.decorator'
import { getTokenTypeAbi, getTransferEventTokenType, parseLog, sleep } from '@app/notifications-service/common/utils/helper-functions'
import { eventsScannerStatusModelString } from '@app/notifications-service/events-scanner/events-scanner.constants'
import { EventsScannerStatus } from '@app/notifications-service/events-scanner/interfaces/events-scaner-status.interface'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'
import { BigNumber, BaseProvider, InjectEthersProvider, Log, Contract, EthersContract, InjectContractProvider, formatUnits } from 'nestjs-ethers'
import { EventData } from '@app/notifications-service/common/interfaces/event-data.interface'
import { WebhooksService } from '@app/notifications-service/webhooks/webhooks.service'
import { TokenInfo, TokenInfoCache } from '@app/notifications-service/events-scanner/interfaces/token-info-cache'
import { has } from 'lodash'

@Injectable()
export class EventsScannerService {
  // TODO: Create a Base class for events scanner and transaction scanner services
  private readonly logger = new Logger(EventsScannerService.name)
  private tokenInfoCache: TokenInfoCache = {}

  constructor (
    @Inject(eventsScannerStatusModelString)
    private eventsScannerStatusModel: Model<EventsScannerStatus>,
    @InjectEthersProvider('regular-node')
    private readonly rpcProvider: BaseProvider,
    @InjectContractProvider('regular-node')
    private readonly ethersContract: EthersContract,
    private configService: ConfigService,
    private webhooksService: WebhooksService
  ) { }

  async onModuleInit (): Promise<void> {
    this.start()
  }

  async start () {
    while (true) {
      try {
        let { number: toBlockNumber } = await this.rpcProvider.getBlock('latest')

        const status = await this.getStatus('events')
        const fromBlockNumber = status.blockNumber
          ? status.blockNumber + 1
          : toBlockNumber

        const maxBlocksToProcess = this.configService.get('rpcConfig').rpc.maxBlocksToProcess

        if (fromBlockNumber >= toBlockNumber) {
          const timeout: number = this.configService.get('rpcConfig').timeoutInterval

          await sleep(timeout)
        } else if (toBlockNumber - fromBlockNumber > maxBlocksToProcess) {
          toBlockNumber = fromBlockNumber + maxBlocksToProcess
        }

        await this.processBlocks(
          fromBlockNumber,
          toBlockNumber
        )

        await this.updateStatus('events', toBlockNumber)
      } catch (error) {
        this.logger.error(`Failed to process blocks: ${error}`)
      }
    }
  }

  async getStatus (filter: string) {
    const status = await this.eventsScannerStatusModel.findOne({
      filter
    })

    if (status) {
      return status
    }

    const newStatus = await this.eventsScannerStatusModel.create({
      filter
    })
    return newStatus
  }

  async updateStatus (filter: string, blockNumber: number) {
    await this.eventsScannerStatusModel.updateOne({ filter }, { blockNumber }, { upsert: true })
  }

  @logPerformance('EventScanner::ProcessBlocks')
  async processBlocks (fromBlock: number, toBlock: number) {
    if (fromBlock > toBlock) return

    this.logger.log(`EventFilter: Processing blocks from ${fromBlock} to ${toBlock}`)

    const logs = await this.rpcProvider.getLogs({
      fromBlock,
      toBlock,
      topics: [ERC20_TRANSFER_EVENT_HASH]
    })

    for (const log of logs) {
      try {
        await this.processEvent(log)
      } catch (error) {
        this.logger.error('Failed to process log:')
        this.logger.error({ log })
        this.logger.error(error)
      }
    }
  }

  @logPerformance('EventScanner::ProcessEvent')
  async processEvent (log: Log) {
    this.logger.log(`Processing event from block: ${log.blockNumber} & txHash: ${log.transactionHash}`)

    const tokenType = getTransferEventTokenType(log)
    const abi = getTokenTypeAbi(tokenType)

    const parsedLog = parseLog(log, abi)
    const fromAddress = parsedLog.args[0]
    const toAddress = parsedLog.args[1]

    const tokenAddress = parsedLog.address

    let name: string
    let symbol: string
    let decimals: number

    try {
      [name, symbol, decimals] = await this.getTokenInfo(tokenAddress, abi, tokenType)
    } catch (err) {
      this.logger.error(`Unable to get token info at address ${tokenAddress}: \n${err}`)
    }

    const eventData: EventData = {
      to: toAddress,
      from: fromAddress,
      txHash: parsedLog.transactionHash,
      tokenAddress: parsedLog.address,
      blockNumber: log.blockNumber,
      blockHash: log.blockHash,
      tokenType: tokenType?.valueOf(),
      tokenName: name,
      tokenSymbol: symbol,
      value: null,
      tokenDecimals: null,
      tokenId: null,
      valueEth: null,
      isInternalTransaction: false
    }

    if (tokenType === TokenType.ERC20) {
      eventData.value = BigNumber.from(parsedLog.args[2]).toString()
      eventData.tokenDecimals = decimals
      eventData.valueEth = formatUnits(eventData.value, eventData.tokenDecimals)
    } else {
      eventData.tokenId = parseInt(parsedLog.args.tokenId?._hex)
    }

    this.webhooksService.processWebhookEvents(eventData).catch((error) => {
      this.logger.error(`Failed to process webhook events for event data :${eventData} - Error: ${error}`)
    })
  }

  @logPerformance('EventScanner::GetTokenInfo')
  private async getTokenInfo (tokenAddress: string, abi: any, tokenType: string) {
    if (has(this.tokenInfoCache, tokenAddress)) {
      this.logger.log(`Token info for ${tokenAddress} was found in cache...`)
      const token = this.tokenInfoCache[tokenAddress]
      return [token.name, token.symbol, token.decimals]
    }
    
    this.logger.log(`Token info for ${tokenAddress} was not found in cache...`)

    const contract: Contract = this.ethersContract.create(
      tokenAddress,
      abi
    )

    let decimals: string

    if (tokenType === TokenType.ERC20) {
      decimals = await contract.decimals()
    }
    const name = await contract.name()
    const symbol = await contract.symbol()

    this.tokenInfoCache[tokenAddress] = { name, symbol, decimals } as TokenInfo

    return [name, symbol, decimals]
  }
}
