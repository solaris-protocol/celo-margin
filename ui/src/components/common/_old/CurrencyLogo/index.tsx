import { Token } from '@ubeswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import useHttpLocations from '../../../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../../../state/lists/hooks'
import Logo from '../Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Token
  size?: string
  style?: React.CSSProperties
}) {
  // TODO: hack
  if (currency?.address === '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9') {
    currency = new WrappedTokenInfo(
      {
        address: currency.address,
        name: 'Celo',
        symbol: 'CELO',
        chainId: currency.chainId,
        decimals: currency.decimals,
        logoURI: 'https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_CELO.png',
      },
      []
    )
  } else if (currency?.address === '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1') {
    currency = new WrappedTokenInfo(
      {
        address: currency.address,
        name: 'Celo Dollar',
        symbol: 'cUSD',
        chainId: currency.chainId,
        decimals: currency.decimals,
        logoURI: 'https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_cUSD.png',
      },
      []
    )
  }

  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, currency.logoURI ?? currency.address]
      }

      return []
    }
    return []
  }, [currency, uriLocations])

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
