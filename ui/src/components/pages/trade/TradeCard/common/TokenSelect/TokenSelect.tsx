import { Token } from '@ubeswap/sdk'
import React, { FC } from 'react'
import styled from 'styled-components'

import CurrencyLogo from '../../../../../common/_old/CurrencyLogo'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const Symbol = styled.span`
  margin-left: 15px;

  color: #fff;
  font-size: 30px;
  line-height: 37px;
  letter-spacing: 0.02em;
  white-space: nowrap;
`

interface Props {
  currency?: Token | null
}

export const TokenSelect: FC<Props> = ({ currency }) => {
  if (!currency) {
    return null
  }

  return (
    <Wrapper>
      <CurrencyLogo currency={currency} size={'35px'} />
      <Symbol>{currency.symbol}</Symbol>
    </Wrapper>
  )
}
