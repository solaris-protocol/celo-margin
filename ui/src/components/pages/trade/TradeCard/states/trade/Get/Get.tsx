import { useContractKit } from '@celo-tools/use-contractkit'
import { CELO } from '@ubeswap/sdk'
import { ChainId as UbeswapChainId } from '@ubeswap/sdk/dist/constants'
import Row from 'components/common/Row'
import { rgba } from 'polished'
import React, { FC } from 'react'
import styled from 'styled-components'

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

interface Props {}

export const Get: FC<Props> = (props) => {
  const {
    network: { chainId },
  } = useContractKit()
  const celo = CELO[chainId as unknown as UbeswapChainId]
  const currency = celo // useCurrency('0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9') // 0x471EcE3750Da237f93B8E339c536989b8978a438
  const value = 0

  return (
    <Wrapper>
      <Row justify="space-between">
        <SubTitle>GET</SubTitle>
        <Reverse onClick={() => {}} />
      </Row>
      <InputBlock>
        <TokenSelect currency={currency} />
        <Balance>{value}</Balance>
      </InputBlock>
      <ValueLine>
        <Row justify="space-between">
          <Rate />
          {value ? <BalanceUSD>2,000 cUSD</BalanceUSD> : null}
        </Row>
      </ValueLine>
    </Wrapper>
  )
}
