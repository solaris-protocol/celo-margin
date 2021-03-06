import React from 'react'
import styled from 'styled-components'

import { TYPE } from '../../../../theme'
import Settings from '../../../common/_old/Settings'
import { RowBetween } from '../../../common/Row'

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader({
  title = 'Swap',
  hideSettings = false,
}: {
  title?: string
  hideSettings?: boolean
}) {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <TYPE.black fontWeight={500}>{title}</TYPE.black>
        {hideSettings || <Settings />}
      </RowBetween>
    </StyledSwapHeader>
  )
}
