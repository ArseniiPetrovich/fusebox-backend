import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { log } from 'console'
import { EIP1193Provider, Web3 } from 'web3'

@Injectable()
export default class Web3ProviderService {
  private readonly provider: any

  constructor(
    private configService: ConfigService
  ) {
    const prv = new Web3.providers.HttpProvider(this.configService.get('rpcConfig').rpc.url)
    const eip1193Compatible = prv.asEIP1193Provider().connect()
    this.provider = eip1193Compatible
    // this.provider.on('error', (error) => {
    //   console.log(error);
    // })
  }

  getProvider() {
    return this.provider
  }
}
