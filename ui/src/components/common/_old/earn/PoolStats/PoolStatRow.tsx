import { LightQuestionHelper } from 'components/common/_old/QuestionHelper'
import { RowBetween, RowFixed } from 'components/common/Row'
import React from 'react'
import { TYPE } from 'theme'

export interface PoolRewardProps {
  helperText?: React.ReactNode
  statName: string
  statValue?: string
}

export default function PoolStatRow({ helperText, statName, statValue }: PoolRewardProps) {
  return (
    <RowBetween>
      <RowFixed>
        <TYPE.white>{statName}</TYPE.white>
        {helperText && <LightQuestionHelper text={helperText} />}
      </RowFixed>
      <TYPE.white>{statValue ? statValue : '-'}</TYPE.white>
    </RowBetween>
  )
}
