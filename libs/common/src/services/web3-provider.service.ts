import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Web3 from 'web3'
import Ethers from 'nestjs-ethers'

@Injectable()
export default class Web3ProviderService {
  private readonly provider: any

  constructor(
    private configService: ConfigService
  ) {
    this.provider = new Web3(new HttpProvider(this.configService.get('rpcConfig').rpc.url))
    const wsprovier = this.provider.asEIP1193Provider();

  }


  getProvider() {
    return this.provider
  }
}
