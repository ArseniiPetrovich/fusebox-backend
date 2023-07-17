import Web3 from 'web3';
import { Wallet } from 'ethers';
import paymasterABI from './EtherspotPaymaster.abi.json'; // EtherspotPaymaster ABI
import { arrayify, defaultAbiCoder, hexConcat } from 'ethers/lib/utils';
import { ConfigService } from '@nestjs/config';

export async function pm_sponsorUserOperation(
  body: any,
  web3: Web3,
  configService: ConfigService,
) {
  let [op] = body;
  const { timestamp } = await web3.eth.getBlock('latest');
  const validUntil = parseInt(timestamp.toString()) + 240;
  const validAfter = 0;

  // When the initCode is not empty, we need to increase the gas values. Multiplying everything by 3 seems to work, but we 
  // need to have a better approach to estimate gas and update accordingly. 
  if (op.initCode !== "0x") {
    op.preVerificationGas = op.preVerificationGas * 3;
    op.verificationGasLimit = op.verificationGasLimit * 3;
    op.callGasLimit = op.callGasLimit * 3;
  }

  const paymasterAddress = configService.getOrThrow(
    'PAYMASTER_CONTRACT_ADDRESS',
  );
  const paymasterContract: any = new web3.eth.Contract(
    paymasterABI as any,
    paymasterAddress,
  );

  // TODO: Add a check if the sender account address is whitelisted for the paymaster account
  // TODO: we need to figure out whether the gases needs to be update. If so, they needs to be updated prior signing calling `getHash` on the paymaster
  // op.verificationGasLimit = BigNumber.from(400000).toHexString();
  // op.preVerificationGas = BigNumber.from(150000).toHexString();
  // op.callGasLimit = BigNumber.from(150000).toHexString();
  const hash = await paymasterContract.methods
    .getHash(op, validUntil, validAfter)
    .call();

  const privateKeyString = configService.getOrThrow(
    'PAYMASTER_SIGNER_PRIVATE_KEY',
  );
  const paymasterSigner = new Wallet(privateKeyString);
  const signature = await paymasterSigner.signMessage(arrayify(hash));

  const validUntilHex = web3.utils.numberToHex(validUntil);
  const validAfterHex = web3.utils.numberToHex(validAfter);

  const paymasterAndData = hexConcat([
    paymasterAddress,
    defaultAbiCoder.encode(
      ['uint48', 'uint48'],
      [validUntilHex, validAfterHex],
    ),
    signature,
  ]);

  return {
    paymasterAndData,
    preVerificationGas: op.preVerificationGas,
    verificationGasLimit: op.verificationGasLimit,
    callGasLimit: op.callGasLimit,
  };
}
