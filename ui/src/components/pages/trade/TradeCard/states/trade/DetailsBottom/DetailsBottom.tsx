import classNames from 'classnames'
import { rgba } from 'polished'
import React, { FC } from 'react'
import styled from 'styled-components'

import { SubTitle } from '../../../common/styled'

const Wrapper = styled.div`
  display: flex;
  grid-column-gap: 40px;
  max-width: 502px;
  width: 100%;
  margin-top: -4rem;
  padding: calc(25px + 1rem) 30px 30px;

  background: #151016;
  border: 2px solid ${rgba('#A077B0', 0.2)};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  opacity: 0;
  transition: opacity 600ms cubic-bezier(0.7, -0.4, 0.4, 1.4);
  z-index: -2;

  &.show {
    opacity: 1;
  }
`

const Column = styled.div``

const Text = styled.div`
  margin-top: 10px;

  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.02em;
`

interface Props {
  show: boolean
}

export const DetailsBottom: FC<Props> = ({ show }) => {
  return (
    <Wrapper className={classNames({ show })}>
      <Column>
        <SubTitle className="secondary medium">Margin Deposit</SubTitle>
        <Text>1,000 cUSD</Text>
      </Column>
      <Column>
        <SubTitle className="secondary medium">Trade amount</SubTitle>
        <Text>1,000 cUSD</Text>
      </Column>
      <Column>
        <SubTitle className="secondary medium">Fee</SubTitle>
        <Text>0.35%</Text>
      </Column>
    </Wrapper>
  )
}
