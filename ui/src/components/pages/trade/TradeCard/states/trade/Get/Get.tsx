import { Token } from '@ubeswap/sdk'
import BN from 'bn.js'
import Row from 'components/common/Row'
import { rgba } from 'polished'
import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { fromWei, toBN } from 'web3-utils'

import { useTrade } from '../../../../../../../app/contexts/trade'
import { useMoolaOracleContract } from '../../../../../../../hooks/useContract'
import { useSingleCallResult } from '../../../../../../../state/multicall/hooks'
import { InputBlockBase, SubTitle } from '../../../common/styled'
import { TokenSelect } from '../../../common/TokenSelect'
import { Rate } from '../Rate'
import { Reverse } from './Reverse'

const Wrapper = styled.div``

const InputBlock = styled(InputBlockBase)`
  padding-right: 15px;
`

const Balance = styled.div`
  color: #fff;
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  letter-spacing: 0.02em;
`

const ValueLine = styled.div`
  color: ${({ theme }) => rgba(theme.text1, 0.5)};
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.02em;
`

const BalanceUSD = styled.div``

interface Props {
  token: Token
}

export const Get: FC<Props> = ({ token }) => {
  const { tokenA, valueA, leverage } = useTrade()

  const moolaOracle = useMoolaOracleContract()

  const cUSDPrice: BN | undefined = useSingleCallResult(moolaOracle, 'getAssetPrice', [tokenA.address])?.result?.[0]
  const cUSDPriceInteger = Number(fromWei(cUSDPrice?.toString() || '0', 'ether'))
  const rate = cUSDPriceInteger ? 1 / cUSDPriceInteger : 1

  const loanAmount = useMemo(() => {
    if (!cUSDPrice) {
      return toBN(0)
    }

    return toBN(valueA).mul(toBN(leverage)).muln(cUSDPriceInteger)
  }, [valueA, cUSDPrice, leverage])

  return (
    <Wrapper>
      <Row justify="space-between">
        <SubTitle>GET</SubTitle>
        <Reverse onClick={() => {}} />
      </Row>
      <InputBlock>
        <TokenSelect currency={token} />
        <Balance>{loanAmount.toString()}</Balance>
      </InputBlock>
      <ValueLine>
        <Row justify="space-between">
          <Rate />
          {loanAmount ? (
            <BalanceUSD>
              {loanAmount.muln(rate).toString()} {tokenA.symbol}
            </BalanceUSD>
          ) : null}
        </Row>
      </ValueLine>
    </Wrapper>
  )
}
