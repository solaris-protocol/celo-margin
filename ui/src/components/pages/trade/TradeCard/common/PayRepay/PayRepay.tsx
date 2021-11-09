import { useContractKit } from '@celo-tools/use-contractkit'
import { Token, TokenAmount } from '@ubeswap/sdk'
import { ReactComponent as WalletIcon } from 'assets/icons/wallet-icon.svg'
import classNames from 'classnames'
import { rgba } from 'polished'
import React, { FC } from 'react'
import styled from 'styled-components'

import { useCurrencyBalance } from '../../../../../../state/wallet/hooks'
import { BalanceInput } from '../../../../../common/BalanceInput'
import { StateType } from '../../types'
import { InputBlockBase, SubTitle } from '../styled'
import { TokenSelect } from '../TokenSelect'

const Wrapper = styled.div``

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Group = styled.div`
  display: grid;
  grid-column-gap: 10px;
  grid-auto-flow: column;
`

const Balance = styled.div`
  display: flex;
  align-items: center;
  margin-top: -9px;

  color: ${({ theme }) => theme.text1};
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.06em;
`

const WalletIconStyled = styled(WalletIcon)`
  margin-right: 10px;

  color: ${({ theme }) => rgba(theme.text2, 0.5)}; ;
`

const InputBlock = styled(InputBlockBase)`
  padding: 18px 15px;

  background: #211823;
  border: 1px solid #524558;
  border-radius: 15px;

  &.active {
    border-color: #9a2cb1;
  }
`

interface Props {
  token: Token
  value: string
  setValue: (nextValue: string) => void
  state: StateType
  setState: (state: StateType) => void
}

export const PayRepay: FC<Props> = ({ token, value, setValue, state, setState }) => {
  const { address: wallet } = useContractKit()

  const balance: TokenAmount | undefined = useCurrencyBalance(wallet ?? undefined, token ?? undefined)

  return (
    <Wrapper>
      <Header>
        <Group>
          <SubTitle className={classNames({ secondary: state != 'trade' })} onClick={() => setState('trade')}>
            Pay
          </SubTitle>
          <SubTitle className={classNames({ secondary: state != 'repay' })} onClick={() => setState('repay')}>
            Repay
          </SubTitle>
        </Group>
        <Balance>
          <WalletIconStyled />
          {balance?.toFixed(2, { groupSeparator: ',' }) ?? '0'} {token?.symbol}
        </Balance>
      </Header>
      <InputBlock className={classNames({ active: !!value })}>
        <TokenSelect currency={token} />
        <BalanceInput maxValue={balance} value={value} onChange={(nextValue) => setValue(nextValue)} />
      </InputBlock>
    </Wrapper>
  )
}
