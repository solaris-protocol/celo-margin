import { ChainId, useContractKit } from '@celo-tools/use-contractkit'
import { CELO, ChainId as UbeswapChainId } from '@ubeswap/sdk'
import { lighten, rgba } from 'polished'
import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import { useTokenBalance } from 'state/wallet/hooks'
import styled from 'styled-components'

import Logo from '../../../assets/logo.svg'
import { useDarkModeManager } from '../../../state/user/hooks'
import { SideModalWallet } from '../../modals/SideModalWallet'
import { YellowCard } from '../_old/Card'
import { RowFixed } from '../Row'
import { Web3Status } from './Web3Status'

const Wrapper = styled.div`
  position: relative;
  top: 0;

  display: grid;
  flex-direction: row;
  grid-template-columns: 1fr 120px;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 1.5625rem;

  z-index: 2;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: inherit 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => rgba(theme.bg1, 0.99)};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 35px;
  height: 35px;
  margin: 0 0 0 8px;
  padding: 0.15rem 0.5rem;

  background-color: ${({ theme }) => theme.bg3};
  border-radius: 0.5rem;
  border: none;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => lighten(0.1, theme.bg3)};
  }

  svg {
    margin-top: 2px;
  }

  > * {
    stroke: ${({ theme }) => theme.text2};
  }
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.CeloMainnet]: 'Celo',
  [ChainId.Alfajores]: 'Alfajores',
  [ChainId.Baklava]: 'Baklava',
  [ChainId.EthereumMainnet]: 'Ethereum',
  [ChainId.Kovan]: 'Kovan',
}

export const Header: FC = () => {
  const { address: account, network } = useContractKit()
  const chainId = network.chainId

  const userCELOBalance = useTokenBalance(account ?? undefined, CELO[chainId as unknown as UbeswapChainId])
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  return (
    <Wrapper>
      <SideModalWallet />
      <HeaderRow>
        <Title to="/">
          <img width={isMobile ? '32px' : '50px'} src={Logo} alt="logo" />
        </Title>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>

          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userCELOBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userCELOBalance?.toFixed(2, { groupSeparator: ',' }) ?? '0.00'} CELO
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        {/*<HeaderElementWrap>*/}
        {/*  /!*<StyledMenuButton onClick={() => toggleDarkMode()}>*!/*/}
        {/*  /!*  {darkMode ? <Moon size={20} /> : <Sun size={20} />}*!/*/}
        {/*  /!*</StyledMenuButton>*!/*/}
        {/*  /!*<Menu />*!/*/}
        {/*</HeaderElementWrap>*/}
      </HeaderControls>
    </Wrapper>
  )
}
