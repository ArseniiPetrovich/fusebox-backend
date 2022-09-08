import { IsValidPublicApiKeyGuard } from '@app/api-service/api-keys/guards/is-valid-public-api-key.guard'
import { TransferDto } from '@app/network-service/transfer/dto/trasfer.dto'
import { AddressDto } from '@app/network-service/transfer/dto/walletAddress.dto'
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { TransferApiService } from '@app/api-service/network/transfer-api/transfer-api.service'

// @UseGuards(IsValidPublicApiKeyGuard)
@Controller('v0/transfers')
export class TransferApiController {
    constructor(private readonly transferService: TransferApiService) { }

    @Post('/token')
    transferPost(@Body() transferDto: TransferDto) {
        return this.transferService.transferPost(transferDto)
    }
    @Post('/wallet-token-list')
    tokenListPost(@Body() addressDto: AddressDto) {
        return this.transferService.tokenListPost(addressDto)
    }
    @Post('/token-holders')
    tokenHoldersPost(@Body() addressDto: AddressDto) {
        return this.transferService.tokenHoldersPost(addressDto)
    }
    @Post('/all-transactions')
    allWalletTransactions(@Body() addressDto: AddressDto) {
        return this.transferService.allWalletTransactions(addressDto)
    }
}
