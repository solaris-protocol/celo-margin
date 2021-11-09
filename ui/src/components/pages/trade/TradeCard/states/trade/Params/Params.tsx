import classNames from 'classnames'
import { Input } from 'components/common/Input'
import { rgba } from 'polished'
import React, { FC, useState } from 'react'
import styled from 'styled-components'

import { useTrade } from '../../../../../../../app/contexts/trade'
import { SubTitle } from '../../../common/styled'

const Wrapper = styled.div`
  display: flex;
`

const Column = styled.div`
  flex: 1;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  grid-column-gap: 10px;
`

const Changer = styled.span`
  color: #9c32be;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  cursor: pointer;
`

const CustomWrapper = styled.div`
  display: flex;
  margin-top: 15px;
`

const Values = styled(CustomWrapper)`
  &.positions {
    grid-column-gap: 20px;
  }

  &.leverages {
    grid-column-gap: 13px;
  }
`

const Value = styled.div`
  color: ${({ theme }) => rgba(theme.text1, 0.5)};
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  letter-spacing: 0.02em;

  cursor: pointer;

  &.active {
    color: ${({ theme }) => theme.text1};
  }

  &.disabled {
    cursor: not-allowed;
  }
`

interface Props {}

export const Params: FC<Props> = (props) => {
  const { position, setPosition, leverage, setLeverage } = useTrade()
  const [isCustom, setIsCustom] = useState(false)

  const handleLeverageCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeverage(Number(e.target.value))
  }

  const handleToggleIsCustomClick = () => {
    setIsCustom((state) => !state)
  }

  return (
    <Wrapper>
      <Column>
        <SubTitle>POSITION</SubTitle>
        <Values className="positions">
          <Value onClick={() => setPosition(0)} className={classNames({ active: position === 0 })}>
            Long
          </Value>
          <Value onClick={() => {}} className={classNames({ active: position === 1, disabled: true })}>
            Short
          </Value>
        </Values>
      </Column>
      <Column>
        <Header>
          <SubTitle>LEVERAGE</SubTitle>
          <Changer onClick={handleToggleIsCustomClick}>{isCustom ? 'Ration' : 'Custom'}</Changer>
        </Header>
        {isCustom ? (
          <CustomWrapper as="label">
            <Input onlyDecimal value={leverage} onChange={handleLeverageCustomChange} />
          </CustomWrapper>
        ) : (
          <Values className="leverages">
            <Value onClick={() => setLeverage(2)} className={classNames({ active: leverage === 2 })}>
              2x
            </Value>
            <Value onClick={() => setLeverage(3)} className={classNames({ active: leverage === 3 })}>
              3x
            </Value>
          </Values>
        )}
      </Column>
    </Wrapper>
  )
}
