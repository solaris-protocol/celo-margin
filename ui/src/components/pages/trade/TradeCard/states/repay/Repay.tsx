import { useContractKit } from '@celo-tools/use-contractkit'
import React, { FC, useState } from 'react'
import styled from 'styled-components'

import { useTrade } from '../../../../../../app/contexts/trade'
import { useToggleWalletSelectModal } from '../../../../../../state/application/hooks'
import { Button } from '../../common/Button'
import { PayRepay } from '../../common/PayRepay'
import { TradeBody } from '../../common/TradeBody'
import { StateType } from '../../types'
import { Params } from './Params'

const ButtonStyled = styled(Button)`
  margin-top: 29px;
`

interface Props {
  state: StateType
  setState: (state: StateType) => void
}

export const Repay: FC<Props> = ({ state, setState }) => {
  const { address: wallet } = useContractKit()
  const toggleWalletSelectModal = useToggleWalletSelectModal()
  const { tokenA } = useTrade()

  const [value, setValue] = useState('')

  return (
    <TradeBody>
      <PayRepay token={tokenA} value={value} setValue={setValue} state={state} setState={setState} />
      <Params />
      {!wallet ? (
        <ButtonStyled onClick={toggleWalletSelectModal}>Connect wallet</ButtonStyled>
      ) : (
        <ButtonStyled onClick={() => {}}>Buy more</ButtonStyled>
      )}
    </TradeBody>
  )
}
