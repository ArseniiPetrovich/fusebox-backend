import { SmartWalletsAuthDto } from '@app/smart-wallets-service/dto/smart-wallets-auth.dto'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { arrayify, computeAddress, hashMessage, recoverPublicKey } from 'nestjs-ethers'
import { SmartWalletService } from '@app/smart-wallets-service/smart-wallets/interfaces/smart-wallets.interface'
import { NotificationsService } from '@app/api-service/notifications/notifications.service'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { catchError, lastValueFrom, map } from 'rxjs'
import { ChargeApiService } from '@app/apps-service/charge-api/charge-api.service'

// import { ISmartWalletUser } from '@app/common/interfaces/smart-wallet.interface'
// import CentrifugoAPIService from '@app/common/services/centrifugo.service'

@Injectable()
export class SmartWalletsAAService implements SmartWalletService {
  private readonly logger = new Logger(SmartWalletsAAService.name)

  constructor (
    private readonly jwtService: JwtService,
    private httpService: HttpService,
    private readonly notificationsService: NotificationsService,
    private configService: ConfigService,
    private chargeApiService: ChargeApiService
    // private readonly centrifugoAPIService: CentrifugoAPIService,
  ) { }

  async auth (smartWalletsAuthDto: SmartWalletsAuthDto) {
    try {
      const publicKey = recoverPublicKey(arrayify(hashMessage(arrayify(smartWalletsAuthDto.hash))), smartWalletsAuthDto.signature)
      const recoveredAddress = computeAddress(publicKey)

      const smartWalletAddress = smartWalletsAuthDto.smartWalletAddress

      if (recoveredAddress === smartWalletsAuthDto.ownerAddress && smartWalletAddress) {
        const jwt = this.jwtService.sign({
          sub: recoveredAddress,
          info: {
            smartWalletAddress: smartWalletsAuthDto.smartWalletAddress,
            ownerAddress: recoveredAddress
          },
          channels: ['transaction']
        })

        console.log(smartWalletAddress)

        // await this.addWebhookAddress(smartWalletAddress)
        this.chargeApiService.addWebhookAddressForAA(smartWalletAddress)

        return { jwt }
      } else {
        throw new Error('Owner Address does not match recovered address in signature')
      }
    } catch (err) {
      this.logger.error(`An error occurred during Smart Wallets Auth. ${err}`)
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  // async httpProxyPost(url: string, requestBody: any) {
  //   const responseData = await lastValueFrom(
  //     this.httpService.post(url, requestBody)
  //       .pipe(map((response) => {
  //         return response.data
  //       })
  //       )
  //       .pipe(
  //         catchError(e => {
  //           throw new HttpException(
  //             `${e?.response?.statusText}: ${e?.response?.data?.error}`,
  //             e?.response?.status
  //           )
  //         })
  //       )
  //   )

  //   return responseData
  // }

  // private async addWebhookAddress(address: string) {
  //   const url = `http://localhost:5002/api/v0/notifications/webhook/add-addresses?apiKey=pk_nQu6CAR89BWU863Hrq41Ta0y`

  //   const requestBody = {
  //     webhookId: this.configService.get('webhookId'),
  //     addresses: [address]
  //   }
  //   console.log(requestBody);

  //   await this.httpProxyPost(url, requestBody)
  // }

  // private async subscribeWalletToNotifications(walletAddress: string) {
  //   // return this.notificationsService.createAddresses({
  //   //   webhookId: webhookID, addresses: [walletAddress]
  //   // })
  // }
  // async getHistoricalTxs (user: ISmartWalletUser) { }
}
