import styled from 'styled-components'

export const ProviderButton = styled.button`
  position: relative;

  display: flex;
  align-items: center;
  width: 278px;
  height: 45px;
  padding: 0 13px 0 17px;

  color: #907a99;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.02em;
  text-align: left;

  background: rgba(255, 255, 255, 0.05);
  background-clip: padding-box;
  border: 1px solid transparent;
  border-radius: 10px;

  &.isActive {
    background: #2a1a2e;

    &::before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;

      margin: -2px;

      background: linear-gradient(180deg, #b745bc, #7b279a);
      border-radius: inherit;

      content: '';
    }
  }

  &:not(:last-child) {
    margin-bottom: 15px;
  }
`
