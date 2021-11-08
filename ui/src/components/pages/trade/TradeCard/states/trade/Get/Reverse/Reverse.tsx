import { ReactComponent as ReverseIcon } from 'assets/icons/reverse-icon.svg'
import React, { FC } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ReverseWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;

  border: 1px solid #524558;
  border-radius: 50%;
`

const ReverseIconStyled = styled(ReverseIcon)`
  color: ${({ theme }) => theme.text1}; ;
`

interface Props {
  onClick: () => void
}

export const Reverse: FC<Props> = ({ onClick }) => {
  return (
    <Wrapper>
      <ReverseWrapper onClick={onClick}>
        <ReverseIconStyled />
      </ReverseWrapper>
    </Wrapper>
  )
}
