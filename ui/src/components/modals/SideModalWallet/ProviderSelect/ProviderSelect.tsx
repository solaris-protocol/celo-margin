import { Provider, useContractKit } from '@celo-tools/use-contractkit'
import classNames from 'classnames'
import React, { FC } from 'react'
import styled from 'styled-components'
import { shortenAddress } from 'utils'

import { ProviderButton } from '../common/styled'

const Name = styled.span`
  flex: 1;
  margin-left: 13px;
`

const Address = styled.span`
  color: #907a99;
  font-weight: 500;
  font-size: 11px;
  letter-spacing: 0.02em;
`

interface Props {
  provider: Provider
  onClick: () => void
}

export const ProviderSelect: FC<Props> = ({ provider, onClick }) => {
  const { address: wallet, walletType } = useContractKit()

  const handleProviderClick = () => {
    if (provider.canConnect()) {
      onClick()
      return
    }

    if (provider.installURL) {
      window.open(provider.installURL, '_blank', 'noopener,noreferrer')
    }
  }

  const renderWalletAddress = () => {
    if (walletType !== provider.name || !wallet) {
      return null
    }

    return <Address>{shortenAddress(wallet)}</Address>
  }

  return (
    <ProviderButton onClick={handleProviderClick} className={classNames({ isActive: walletType === provider.name })}>
      {typeof provider.icon === 'string' ? (
        <img src={provider.icon} alt={`${provider.name} logo`} style={{ height: '20px', width: '20px' }} />
      ) : (
        <provider.icon style={{ height: '20px', width: '20px' }} />
      )}
      <Name>{provider.canConnect() ? provider.name : `Install ${provider.name}`}</Name>
      {renderWalletAddress()}
    </ProviderButton>
  )
}
