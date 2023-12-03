import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Web3 from 'web3'

@Injectable()
export default class Web3ProviderService {
  private readonly provider: Web3

  constructor(
    private configService: ConfigService
  ) {
    this.provider = new Web3(this.configService.get('rpcConfig').rpc.url)
    this.provider.eth.subscribe('logs', { fromBlock: 'latest' }, function (error, result) {
      if (!error)
        console.log(result);
    }).on("connected", function (subscriptionId) {
      console.log(subscriptionId);
    }).on("data", function (log) {
      console.log(log);
    })

  }


  getProvider() {
    return this.provider
  }
}
