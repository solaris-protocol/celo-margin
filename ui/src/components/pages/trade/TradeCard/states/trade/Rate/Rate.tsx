import { useTrade } from 'app/contexts/trade'
import BN from 'bn.js'
import { FC } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { fromWei } from 'web3-utils'

import { useMoolaOracleContract } from '../../../../../../../hooks/useContract'

export const Rate: FC = () => {
  const { tokenA } = useTrade()
  const moolaOracle = useMoolaOracleContract()

  const cUSDPrice: BN | undefined = useSingleCallResult(moolaOracle, 'getAssetPrice', [tokenA.address])?.result?.[0]
  const cUSDPriceInteger = Number(fromWei(cUSDPrice?.toString() || '0', 'ether'))

  const rate = cUSDPriceInteger.toFixed(2)

  return <>1 Celo ≈ {rate} cUSD</>
}
