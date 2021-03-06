import { useTrade } from 'app/contexts/trade'
import { rgba } from 'polished'
import React, { FC } from 'react'
import styled from 'styled-components'

import { PayRepay } from '../../common/PayRepay'
import { TradeBody } from '../../common/TradeBody'
import { StateType } from '../../types'
import { ButtonOpenPosition } from './ButtonOpenPosition'
import { DetailsBottom } from './DetailsBottom'
import { Get } from './Get'
import { Params } from './Params'

const Delimiter = styled.div`
  height: 1px;
  margin: 30px 0 40px;

  background: ${rgba('#A077B0', 0.2)};
  border-radius: 2px;
`

interface Props {
  state: StateType
  setState: (state: StateType) => void
}

export const Trade: FC<Props> = ({ state, setState }) => {
  const { tokenA, tokenB, valueA, setValueA } = useTrade()

  return (
    <>
      <TradeBody moveUp={!!valueA}>
        <PayRepay token={tokenA} value={valueA} setValue={setValueA} state={state} setState={setState} />
        <Get token={tokenB} />
        <Delimiter />
        <Params />
        <ButtonOpenPosition />
      </TradeBody>
      <DetailsBottom show={!!valueA} />
    </>
  )
}
