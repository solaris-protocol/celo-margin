import { rgba } from 'polished'
import styled from 'styled-components'

export const SubTitle = styled.span`
  display: inline-block;

  color: ${({ theme }) => theme.text1};
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  text-transform: uppercase;

  &.secondary {
    color: ${({ theme }) => rgba(theme.text2, 0.5)};

    cursor: pointer;
  }

  &.medium {
    font-weight: 500;
  }
`

export const InputBlockBase = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 17px;
`
