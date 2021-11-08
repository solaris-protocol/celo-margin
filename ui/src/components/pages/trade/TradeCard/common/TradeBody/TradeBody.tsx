import { useContractKit } from '@celo-tools/use-contractkit'
import classNames from 'classnames'
import { rgba } from 'polished'
import React, { FC } from 'react'
import styled from 'styled-components'

const Border = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 2px;

  background: rgba(144, 122, 153, 0.3);
  border-radius: 20px;

  &.active {
    background: linear-gradient(139deg, #39d0ff 0, #00a0fa 5%, #7b279a);
  }

  transform: translateY(0);
  transition: transform 600ms cubic-bezier(0.7, -0.4, 0.4, 1.4);

  &.moveUp {
    transform: translateY(-3rem);
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding: 25px 30px 30px;

  background: ${({ theme }) => rgba(theme.bg1, 0.99)};
  border-radius: 20px;
`

interface Props {
  moveUp?: boolean
  className?: string
}

export const TradeBody: FC<Props> = ({ moveUp, className, children }) => {
  const { address: wallet } = useContractKit()

  return (
    <Border className={classNames(className, { active: !!wallet, moveUp })}>
      <Wrapper>{children}</Wrapper>
    </Border>
  )
}
