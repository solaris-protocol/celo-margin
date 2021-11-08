import classNames from 'classnames'
import { rgba } from 'polished'
import React, { FC, useState } from 'react'
import styled from 'styled-components'

import { SubTitle } from '../../../common/styled'

const Wrapper = styled.div`
  display: flex;
  grid-column-gap: 20px;
  margin-top: 11px;
`

const Column = styled.div``

const Text = styled.div`
  margin-top: 10px;

  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.06em;
`

const Values = styled.div`
  display: flex;
  grid-column-gap: 16px;
`

const Value = styled(Text)`
  color: ${({ theme }) => rgba(theme.text2, 0.5)};
  letter-spacing: 0.02em;

  cursor: pointer;

  &.active {
    color: ${({ theme }) => theme.text1};
  }
`

interface Props {}

export const Params: FC<Props> = (props) => {
  const [repayPercent, setRepayPercent] = useState(0)

  return (
    <Wrapper>
      <Column>
        <SubTitle className="secondary medium">Borrowed</SubTitle>
        <Text>1,000 cUSD</Text>
      </Column>
      <Column>
        <SubTitle className="secondary medium">Pair</SubTitle>
        <Text>cUSD/CELO</Text>
      </Column>
      <Column>
        <SubTitle className="secondary medium">Lev</SubTitle>
        <Text>2x</Text>
      </Column>
      <Column>
        <SubTitle className="secondary medium">Repay</SubTitle>
        <Values>
          <Value onClick={() => setRepayPercent(25)} className={classNames({ active: repayPercent === 25 })}>
            25%
          </Value>
          <Value onClick={() => setRepayPercent(50)} className={classNames({ active: repayPercent === 50 })}>
            50%
          </Value>
          <Value onClick={() => setRepayPercent(75)} className={classNames({ active: repayPercent === 75 })}>
            75%
          </Value>
          <Value onClick={() => setRepayPercent(100)} className={classNames({ active: repayPercent === 100 })}>
            100%
          </Value>
        </Values>
      </Column>
    </Wrapper>
  )
}
