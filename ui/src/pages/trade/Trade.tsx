import { TradeProvider } from 'app/contexts/trade'
import { TradeCard } from 'components/pages/trade/TradeCard'
import React, { FC } from 'react'

interface Props {}

export const Trade: FC<Props> = () => {
  return (
    <TradeProvider>
      <TradeCard />
    </TradeProvider>
  )
}
