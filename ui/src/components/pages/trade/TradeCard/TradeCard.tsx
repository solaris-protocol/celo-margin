import React, { FC, useState } from 'react'

import { Repay } from './states/repay'
import { Trade } from './states/trade'
import { StateType } from './types'

interface Props {}

export const TradeCard: FC<Props> = () => {
  const [state, setState] = useState<StateType>('trade')

  switch (state) {
    case 'repay':
      return <Repay state={state} setState={setState} />
    case 'trade':
    default:
      return <Trade state={state} setState={setState} />
  }
}
