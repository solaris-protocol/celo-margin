import { useContractKit } from '@celo-tools/use-contractkit'
import { rgba } from 'polished'
import React, { FC, useState } from 'react'
import styled from 'styled-components'

import { useToggleWalletSelectModal } from '../../../../../../state/application/hooks'
import { Button } from '../../common/Button'
import { PayRepay } from '../../common/PayRepay'
import { TradeBody } from '../../common/TradeBody'
import { StateType } from '../../types'
import { DetailsBottom } from './DetailsBottom'
import { Get } from './Get'
import { Params } from './Params'

const Delimiter = styled.div`
  height: 1px;
  margin: 30px 0 40px;

  background: ${rgba('#A077B0', 0.2)};
  border-radius: 2px;
`

const ButtonStyled = styled(Button)`
  margin-top: 34px;
`

interface Props {
  state: StateType
  setState: (state: StateType) => void
}

export const Trade: FC<Props> = ({ state, setState }) => {
  const { address: wallet } = useContractKit()
  const toggleWalletSelectModal = useToggleWalletSelectModal()

  const [value, setValue] = useState('')

  return (
    <>
      <TradeBody moveUp={!!value}>
        <PayRepay value={value} setValue={setValue} state={state} setState={setState} />
        <Get />
        <Delimiter />
        <Params />
        {!wallet ? (
          <ButtonStyled onClick={toggleWalletSelectModal}>Connect wallet</ButtonStyled>
        ) : (
          <ButtonStyled onClick={() => {}}>Open position</ButtonStyled>
        )}
      </TradeBody>
      <DetailsBottom show={!!value} />
    </>
  )
}
