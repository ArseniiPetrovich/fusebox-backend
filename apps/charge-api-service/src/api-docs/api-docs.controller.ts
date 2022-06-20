import { IsValidApiKeysGuard } from '@app/api-service/api-keys/guards/is-valid-api-keys.guard'
import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common'
import { LegacyApiInterceptor } from '@app/api-service/legacy-api/legacy-api.interceptor'
import { ApiBody, ApiCreatedResponse, ApiHeader, ApiResponse } from '@nestjs/swagger'

@UseGuards(IsValidApiKeysGuard)
@UseInterceptors(LegacyApiInterceptor)
@Controller({ path: 'v0/studio' })
export class ApiDocsController {
  @Post('wallets/create')
  @ApiHeader({
    name: 'API-SECRET',
    description: 'Your Project Secret Key'
  })
  @ApiBody({
    schema: {
      examples: {
        'phoneNumber': '+972554443322'
      }
    }
  })
  @ApiCreatedResponse({ description: 'Wallet creation job has been successfully created'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async post (@Body('phoneNumber') phoneNumber: string) {
    return {
      job: {
        status: 'pending',
        _id: '62af259f52e87500136a9a98',
        name: 'createWallet',
        data: {
          owner: '0x4Af4C23e0e47dE1Ab7e274Ff2e71c9439b034Ee4',
          phoneNumber: '+972777777777',
          _id: '62af259f52e87500136a9a96',
          salt: '0xef7a40f1cb7dd5be6700e99bfd9fb750b77be5a14a44ee3deb0dd08aaf9508fb'
        },
        createdAt: '2022-06-19T13:33:19.397Z',
        updatedAt: '2022-06-19T13:33:19.397Z',
        __v: 0
      }
    }
  }
}
