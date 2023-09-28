import Web3 from 'web3'
import { NATIVE_FUSE_TOKEN } from '@app/smart-wallets-service/common/constants/fuseTokenInfo'
import { Token } from '@app/smart-wallets-service/data-layer/interfaces/token-interfaces'
const BasicTokenAbi = require('@app/smart-wallets-service/common/config/abi/BasicToken.json')
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.fuse.io'))

export const fetchTokenDetails = async (address) => {
  if (address === NATIVE_FUSE_TOKEN.address) {
    return {
      name: NATIVE_FUSE_TOKEN.name,
      address: NATIVE_FUSE_TOKEN.address,
      symbol: NATIVE_FUSE_TOKEN.symbol,
      decimals: 18
    }
  }
  const tokenContractInstance = new web3.eth.Contract(BasicTokenAbi, address)
  try {
    const [name, symbol, decimals] = await Promise.all([
      tokenContractInstance.methods.name().call(),
      tokenContractInstance.methods.symbol().call(),
      tokenContractInstance.methods.decimals().call()
    ])
    const fetchedTokedData: Token = { name, symbol, decimals: parseInt(decimals), address }
    return fetchedTokedData
  } catch (error) {
    const decimals = 0
    const [name, symbol] = await Promise.all([
      tokenContractInstance.methods.name().call(),
      tokenContractInstance.methods.symbol().call()
    ])
    const fetchedTokedData: Token = { name, symbol, decimals, address }
    return fetchedTokedData
  }
}
