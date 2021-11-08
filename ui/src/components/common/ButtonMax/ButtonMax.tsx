import { rgba } from 'polished'
import React, { ButtonHTMLAttributes, FC } from 'react'
import styled from 'styled-components'

const ButtonElement = styled.button`
  height: 26px;
  padding: 0 10px;

  color: ${({ theme }) => theme.text2};
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.15em;
  text-transform: uppercase;

  background: ${({ theme }) => rgba(theme.text2, 0.1)};
  border: 1px solid ${({ theme }) => theme.text2};
  border-radius: 5px;
`

export const ButtonMax: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ ...props }) => {
  return <ButtonElement {...props}>Max</ButtonElement>
}
