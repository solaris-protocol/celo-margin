import { useContractKit } from '@celo-tools/use-contractkit'
import { CELO, cUSD, Token } from '@ubeswap/sdk'
import { ChainId as UbeswapChainId } from '@ubeswap/sdk/dist/constants'
import { useState } from 'react'
import { createContainer } from 'unstated-next'

export interface UseTrade {
  tokenA: Token
  tokenB: Token
  valueA: string
  setValueA: (nextValue: string) => void
  valueB: string
  setValueB: (nextValue: string) => void
  position: number
  setPosition: (nextPosition: number) => void
  leverage: number
  setLeverage: (nextLeverage: number) => void
}

const useTradeInternal = (): UseTrade => {
  const {
    address: wallet,
    network: { chainId },
  } = useContractKit()
  const CUSD = cUSD[chainId as unknown as UbeswapChainId]
  const celo = CELO[chainId as unknown as UbeswapChainId]

  const [tokenA, setTokenA] = useState(CUSD)
  const [tokenB, setTokenB] = useState(celo)
  const [valueA, setValueA] = useState('')
  const [valueB, setValueB] = useState('')
  const [position, setPosition] = useState(0)
  const [leverage, setLeverage] = useState(2)

  return { tokenA, tokenB, valueA, setValueA, valueB, setValueB, position, setPosition, leverage, setLeverage }
}

export const { Provider: TradeProvider, useContainer: useTrade } = createContainer(useTradeInternal)
