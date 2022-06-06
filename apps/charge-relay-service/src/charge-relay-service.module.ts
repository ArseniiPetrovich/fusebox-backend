import { Module } from '@nestjs/common'
import { RelayAccountsModule } from '@app/relay-service/relay-accounts/relay-accounts.module'
import { SqsConfig, SqsModule } from '@nestjs-packages/sqs'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    RelayAccountsModule,
    SqsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => {
        const config = {
          region: configService.region,
          endpoint: configService.endpoint,
          accountNumber: configService.accountNumber,
          credentials: {
            accessKeyId: configService.accessKeyId,
            secretAccessKey: configService.secretAccessKey
          }
        }
        return new SqsConfig(config)
      },
      inject: [ConfigService]
    })
  ]
})
export class ChargeRelayServiceModule { }
