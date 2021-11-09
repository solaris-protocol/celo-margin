import { useContractKit } from '@celo-tools/use-contractkit'
import { CELO, cUSD, JSBI, Token, TokenAmount } from '@ubeswap/sdk'
import { ChainId as UbeswapChainId } from '@ubeswap/sdk/dist/constants'
import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { toBN } from 'web3-utils'

import { useToken } from '../../../../../../../hooks/Tokens'
import {
  ApprovalState,
  useApproveCallback,
  useApproveDelegationCallback,
} from '../../../../../../../hooks/useApproveCallback'
import { useMarginContract, useMoolaV2IProtocolDataProviderContract } from '../../../../../../../hooks/useContract'
import { useToggleWalletSelectModal } from '../../../../../../../state/application/hooks'
import { useSingleCallResult } from '../../../../../../../state/multicall/hooks'
import { useTokenBalance } from '../../../../../../../state/wallet/hooks'
import Loader from '../../../../../../common/_old/Loader'
import { AutoRow } from '../../../../../../common/Row'
import { useDoTransaction } from '../../../../../_old/swap/routing'
import { Button } from '../../../common/Button'

const ButtonStyled = styled(Button)`
  margin-top: 34px;
`

export const ButtonOpenPosition: FC = () => {
  const {
    address: wallet,
    network: { chainId },
  } = useContractKit()
  const toggleWalletSelectModal = useToggleWalletSelectModal()

  // const moolaOracle = useMoolaOracleContract()
  const solarisMargin = useMarginContract()
  const moolaV2IProtocolDataProvider = useMoolaV2IProtocolDataProviderContract()

  const CUSD = cUSD[chainId as unknown as UbeswapChainId]
  const celo = CELO[chainId as unknown as UbeswapChainId]

  const amount = toBN(1000)
  const minAmount = toBN(1)
  const leverage = toBN(2)
  const moolaFlashLoanFee = amount.mul(toBN(35)).div(toBN(10000))
  // const cUSDPrice: BN | undefined = useSingleCallResult(moolaOracle, 'getAssetPrice', [CUSD.address])?.result?.[0]

  const solarisMarginCeloBalance = useTokenBalance(solarisMargin?.address ?? undefined, celo)
  console.log(`###: SolarisMarginCeloBalance`, solarisMarginCeloBalance?.toFixed())
  // console.log(`###: cUSDPrice`, cUSDPrice?.toString())

  const amountToApprove1 = new TokenAmount(CUSD as Token, JSBI.BigInt(amount.toString())) // tryParseAmount(amount.toString(), CUSD)
  const [approval1, approve1] = useApproveCallback(amountToApprove1, solarisMargin?.address)

  // const loanAmount = useMemo(() => {
  //   if (!cUSDPrice) {
  //     return toBN(0)
  //   }
  //
  //   return amount
  //     .mul(leverage.subn(1))
  //     .mul(toBN(cUSDPrice.toString()))
  //     .div(toWei(toBN(1), 'ether'))
  // }, [amount, cUSDPrice, leverage])

  const tokenDetails = useSingleCallResult(moolaV2IProtocolDataProvider, 'getReserveTokensAddresses', [
    CUSD.address,
  ])?.result

  const stableDebtToken = useToken(tokenDetails?.stableDebtTokenAddress)
  // const amountToApprove2 = stableDebtToken
  //   ? new TokenAmount(stableDebtToken as Token, JSBI.BigInt(loanAmount.add(moolaFlashLoanFee).toString()))
  //   : undefined
  const amountToApprove2 = stableDebtToken
    ? new TokenAmount(stableDebtToken as Token, JSBI.BigInt(amount.mul(leverage).add(moolaFlashLoanFee).toString()))
    : undefined

  const [approval2, approve2] = useApproveDelegationCallback(amountToApprove2, solarisMargin?.address)

  const handleApprove1Click = useCallback(() => {
    approve1()
  }, [approve1])

  const handleApprove2Click = useCallback(async () => {
    approve2()
  }, [approve2])

  const doTransaction = useDoTransaction()

  const handleTradeClick = useCallback(async () => {
    if (!solarisMargin) {
      console.error('solarisMargin is null')
      return
    }

    // console.log(`###: loanAmount`, loanAmount.toString())
    // const minAmount = 1 // amount
    // console.log(`###: minAmount`, minAmount.toString())

    doTransaction(solarisMargin, 'openLongPosition', {
      args: [
        CUSD.address,
        celo.address,
        // loanAmount.toString(),
        amount.toString(),
        minAmount.toString(),
        leverage.toString(),
      ],
      summary: 'Open long position',
    })
  }, [CUSD.address, amount, celo.address, doTransaction, leverage, /*loanAmount,*/ solarisMargin])

  if (!wallet) {
    return <ButtonStyled onClick={toggleWalletSelectModal}>Connect wallet</ButtonStyled>
  }

  if (approval1 !== ApprovalState.APPROVED) {
    return (
      <ButtonStyled onClick={handleApprove1Click}>
        {approval1 === ApprovalState.PENDING ? (
          <AutoRow gap="6px" justify="center" align="center">
            Approving <Loader stroke="white" />
          </AutoRow>
        ) : (
          `Approve ${CUSD.symbol}`
        )}
      </ButtonStyled>
    )
  }

  if (approval2 !== ApprovalState.APPROVED) {
    return (
      <ButtonStyled onClick={handleApprove2Click}>
        {approval2 === ApprovalState.PENDING ? (
          <AutoRow gap="6px" justify="center" align="center">
            Approving <Loader stroke="white" />
          </AutoRow>
        ) : (
          `Approve ${celo.symbol}`
        )}
      </ButtonStyled>
    )
  }

  return <ButtonStyled onClick={handleTradeClick}>Open position</ButtonStyled>
}
