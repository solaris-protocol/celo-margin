import React, { FC } from 'react'
import styled from 'styled-components'
import { ExternalLink } from 'theme'

import moolaLogo from '../../../assets/images/moola-logo.png'
import ubeswapLogo from '../../../assets/images/ubeswap-logo.png'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
`

const Text = styled.span`
  margin-right: 15px;

  color: ${({ theme }) => theme.text2};
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.02em;
`

const ImgUbeswap = styled.img`
  width: 92px;
  height: 17px;
`

const Delimiter = styled.div`
  width: 1px;
  height: 20px;
  margin: 0 10px;

  background: rgba(255, 255, 255, 0.3);
`

const ImgMoola = styled.img`
  width: 40px;
  height: 17px;
`

interface Props {}

export const PoweredBy: FC<Props> = (props) => {
  return (
    <Wrapper>
      <Text>Powered by</Text>
      <ExternalLink href="https://ubeswap.org/">
        <ImgUbeswap src={ubeswapLogo} />
      </ExternalLink>
      <Delimiter />
      <ExternalLink href="https://www.moola.market/">
        <ImgMoola src={moolaLogo} />{' '}
      </ExternalLink>
    </Wrapper>
  )
}
