import { UserOpParser, EventProps } from "../../../apps/charge-smart-wallets-service/src/common/utils/user-op-parser"
import { UserOperationBuilder } from "userop"
// import { ERC20_CALLDATA, USER_OP_EVENT_TOPIC_0, USER_OP_EVENT_TOPIC_1, USER_OP_EVENT_TOPIC_2, USER_OP_EVENT_TOPIC_3, USER_OP_EVENT_TOPIC_DATA } from "./constants"
import { assert } from "chai"

export const NATIVE_TRANSFER_CALLDATA = '0xb61d27f60000000000000000000000005bbea139c1b1b32cf7b5c7fd1d1ff802de006117000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000'
export const ERC20_CALLDATA = '0xb61d27f6000000000000000000000000b1232fd89d027e4b949ced570609e8ad0e18811e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000cc95e80da76bd41507b99d9b977dc3062bcf64300000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000'
export const APPROVE_TOKEN_CALLDATA = '0xb61d27f6000000000000000000000000495d133b938596c9984d462f007b676bdc57ecec000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000005bbea139c1b1b32cf7b5c7fd1d1ff802de00611700000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000'
export const STAKE_TOKENS_CALLDATA = '0xb61d27f6000000000000000000000000a3dc222ec847aac61fb6910496295bf344ea46be000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004d0e30db000000000000000000000000000000000000000000000000000000000'
export const UNSTAKE_TOKENS_CALLDATA = '0x47e1da2a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000b1dd0b683d9a56525cc096fbf5eec6e60fe79871000000000000000000000000a3dc222ec847aac61fb6910496295bf344ea46be0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000044095ea7b3000000000000000000000000a3dc222ec847aac61fb6910496295bf344ea46be0000000000000000000000000000000000000000000000000236b5f720d646b90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000242e1a7d4d0000000000000000000000000000000000000000000000000236b5f720d646b900000000000000000000000000000000000000000000000000000000'
export const SWAP_NATIVE_TO_TOKENS_CALLDATA = '0xb61d27f6000000000000000000000000e3f85aad0c8dd7337427b9df5d0fb741d65eeeb5000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e47ff36ab500000000000000000000000000000000000000000000000000000000000000e900000000000000000000000000000000000000000000000000000000000000800000000000000000000000005bbea139c1b1b32cf7b5c7fd1d1ff802de0061170000000000000000000000000000000000000000000000000000000064edf90300000000000000000000000000000000000000000000000000000000000000020000000000000000000000000be9e53fd7edac9f859882afdda116645287c629000000000000000000000000495d133b938596c9984d462f007b676bdc57ecec00000000000000000000000000000000000000000000000000000000'
export const SWAP_TOKENS_TO_TOKENS_CALLDATA = '0x47e1da2a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000495d133b938596c9984d462f007b676bdc57ecec000000000000000000000000e3f85aad0c8dd7337427b9df5d0fb741d65eeeb50000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000044095ea7b3000000000000000000000000e3f85aad0c8dd7337427b9df5d0fb741d65eeeb5000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012438ed17390000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000002bc51d6510171d00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000005bbea139c1b1b32cf7b5c7fd1d1ff802de0061170000000000000000000000000000000000000000000000000000000064f70a150000000000000000000000000000000000000000000000000000000000000003000000000000000000000000495d133b938596c9984d462f007b676bdc57ecec0000000000000000000000000be9e53fd7edac9f859882afdda116645287c629000000000000000000000000588e24ded8f850b14bb2e62e9c50a7cd5ee13da900000000000000000000000000000000000000000000000000000000'
export const BATCH_TRANSACTION_CALLDATA = '0x18dfb3c7000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000495d133b938596c9984d462f007b676bdc57ecec000000000000000000000000495d133b938596c9984d462f007b676bdc57ecec0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000a21d0d4ee4f633e72cee117b93f662adfc30b808000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000a21d0d4ee4f633e72cee117b93f662adfc30b808000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000'
export const TRANSFER_NFT_CALLDATA = '0xb61d27f600000000000000000000000032319834d90323127988e4e2dc7b2162d426290400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000006423b872dd0000000000000000000000005bbea139c1b1b32cf7b5c7fd1d1ff802de0061170000000000000000000000005bbea139c1b1b32cf7b5c7fd1d1ff802de006117000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000'
export const USER_OP_EVENT_TOPIC_0 = '0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f'
export const USER_OP_EVENT_TOPIC_1 = '0x06e70add5d953bdf6e853950651b985860291addd55abadd755ddefee1fd78d6'
export const USER_OP_EVENT_TOPIC_2 = '0x0000000000000000000000006d49a5cb8568cf81c8227394920af0df0fe50a49'
export const USER_OP_EVENT_TOPIC_3 = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const USER_OP_EVENT_TOPIC_DATA = '0x0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000041b312b42fb000000000000000000000000000000000000000000000000000000000000018f8b'


describe("UserOpParser Tests", () => {
  const parser = new UserOpParser()
  beforeEach(function () {
  })
  it("userOp native token transfer calldata", async () => {


    const { walletFunction, targetFunction } = await parser.parseCallData(NATIVE_TRANSFER_CALLDATA)

    assert(walletFunction[0].arguments[0], '0x5BBEA139C1b1b32CF7b5C7fD1D1fF802De006117')
    assert(walletFunction[0].walletFunction, 'execute')
    assert(targetFunction.name, 'nativeTokenTransfer')
  });


  it("userOp erc-20 transfer calldata", async () => {
    const { walletFunction, targetFunction } = await parser.parseCallData(ERC20_CALLDATA)
    assert(walletFunction[0].arguments[0], '0xb1232fD89d027e4B949cED570609e8aD0e18811e')
    assert(walletFunction[0].walletFunction, 'execute')

    assert(targetFunction[0].name, 'transfer')
    assert(targetFunction[0].arguments[0], '0x5BBEA139C1b1b32CF7b5C7fD1D1fF802De006117')
  });

  it("userOp erc-20 approve calldata", async () => {
    const { walletFunction, targetFunction } = await parser.parseCallData(APPROVE_TOKEN_CALLDATA)
    assert(walletFunction[0].arguments[0], '0x495d133B938596C9984d462F007B676bDc57eCEC')
    assert(walletFunction[0].walletFunction, 'execute')

    assert(targetFunction[0].arguments[0], '0x495d133B938596C9984d462F007B676bDc57eCEC')
    assert(targetFunction[0].name, 'approve')
  });
  it("userOp native token stake calldata", async () => {
    const { walletFunction, targetFunction } = await parser.parseCallData(STAKE_TOKENS_CALLDATA)
    assert(walletFunction[0].walletFunction, 'execute')
    assert(walletFunction[0].arguments[0], '0xa3dc222eC847Aac61FB6910496295bF344Ea46be')


    assert(targetFunction[0].name, 'deposit')
  });


  it("userOp native token UNstake calldata", async () => {
    const { walletFunction, targetFunction } = await parser.parseCallData(UNSTAKE_TOKENS_CALLDATA)
    assert(walletFunction[0].walletFunction, 'executeBatch')
    assert(targetFunction[0].targetAddress, '0xb1DD0B683d9A56525cC096fbF5eec6E60FE79871')
    assert(targetFunction[0].name, 'approve')
    assert(targetFunction[0].arguments[0], '0xa3dc222eC847Aac61FB6910496295bF344Ea46be')
    assert(targetFunction[1].targetAddress, '0xa3dc222eC847Aac61FB6910496295bF344Ea46be')
    assert(targetFunction[0].name, 'withdraw')
  });

  it("userOp NFT token transfer calldata", async () => {
    const { walletFunction, targetFunction } = await parser.parseCallData(TRANSFER_NFT_CALLDATA)
    assert(walletFunction[0].walletFunction, 'executeBatch')
    assert(walletFunction[0].arguments[0], '0x32319834d90323127988E4e2DC7b2162d4262904')

    assert(targetFunction[0].name, 'transferFrom')
    assert(targetFunction[0].arguments[0], '0x5BBEA139C1b1b32CF7b5C7fD1D1fF802De006117')
    assert(targetFunction[0].arguments[1], '0x5BBEA139C1b1b32CF7b5C7fD1D1fF802De006117')
  });

  it("userOp swap NATIVE token for tokens calldata", async () => {
    const { walletFunction, targetFunction } = await parser.parseCallData(SWAP_NATIVE_TO_TOKENS_CALLDATA)
    assert(walletFunction[0].walletFunction, 'execute')
    assert(walletFunction[0].arguments[0], '0xE3F85aAd0c8DD7337427B9dF5d0fB741d65EEEB5')
    assert(targetFunction[0].name, 'swapExactETHForTokens')
    assert(targetFunction[0].arguments[1][0], '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629')
    assert(targetFunction[0].arguments[1][1], '0x495d133B938596C9984d462F007B676bDc57eCEC')
    assert(targetFunction[0].arguments[2], '0x5BBEA139C1b1b32CF7b5C7fD1D1fF802De006117')
  });


  it("userOp swap TOKENS for tokens calldata", async () => {
    const { walletFunction, targetFunction } = await parser.parseCallData(SWAP_TOKENS_TO_TOKENS_CALLDATA)
    assert(walletFunction[0].walletFunction, 'execute')
    assert(walletFunction[0].arguments[0], '0xE3F85aAd0c8DD7337427B9dF5d0fB741d65EEEB5')
    assert(targetFunction[1].name, 'swapExactTokensForTokens')
    assert(targetFunction[0].arguments[1][0], '0x495d133B938596C9984d462F007B676bDc57eCEC') //Goodollar
    assert(targetFunction[0].arguments.pop(), '0x588e24DEd8f850b14BB2e62E9c50A7Cd5Ee13Da9') //TerraLuna
    assert(targetFunction[1].arguments[2], '0x5BBEA139C1b1b32CF7b5C7fD1D1fF802De006117')
  });




  it("should parse userOp event", async () => {
    const event: EventProps = {
      topics: [
        USER_OP_EVENT_TOPIC_0,
        USER_OP_EVENT_TOPIC_1,
        USER_OP_EVENT_TOPIC_2,
        USER_OP_EVENT_TOPIC_3
      ],
      data: USER_OP_EVENT_TOPIC_DATA
    }
    const parsedEvent = await parser.parseEvent(event)
    assert(parsedEvent.signature, 'UserOperationEvent(bytes32,address,address,uint256,bool,uint256,uint256)')

  });


});