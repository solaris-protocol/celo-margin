import { TokenAmount } from '@ubeswap/sdk'
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg'
import { rgba } from 'polished'
import React, { FC } from 'react'
import styled from 'styled-components'

import { ButtonMax } from '../ButtonMax'
import { Input } from '../Input'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const ButtonMaxStyled = styled(ButtonMax)`
  margin-right: 13px;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  padding: 5px;

  cursor: pointer;
`

const CloseIconStyled = styled(CloseIcon)`
  width: 14px;
  height: 14px;

  color: ${({ theme }) => rgba(theme.text2, 0.5)};
`

interface Props {
  maxValue?: TokenAmount
  value: string
  onChange: (nextValue: string) => void
}

export const BalanceInput: FC<Props> = ({ maxValue, value, onChange }) => {
  const handleMaxClick = () => {
    if (!maxValue) {
      return
    }

    onChange(maxValue.toFixed(0))
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleValueClear = () => {
    onChange('')
  }

  return (
    <Wrapper>
      {!value && maxValue && <ButtonMaxStyled onClick={handleMaxClick}>Max</ButtonMaxStyled>}
      <Input placeholder="0" value={value} onChange={handleValueChange} />
      {value ? (
        <IconWrapper onClick={handleValueClear}>
          <CloseIconStyled />
        </IconWrapper>
      ) : null}
    </Wrapper>
  )
}
