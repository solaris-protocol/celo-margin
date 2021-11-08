import { DialogContent, DialogOverlay } from '@reach/dialog'
import { useDrag } from '@use-gesture/react'
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg'
import BezierEasing from 'bezier-easing'
import { rgba } from 'polished'
import React, { FC, useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { animated, useSpring, useTransition } from 'react-spring'
import styled, { css } from 'styled-components'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => theme.modalBG};
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ mobile, isOpen, ...rest }) => <AnimatedDialogContent {...rest} />).attrs({
  'aria-label': 'dialog',
})`
  overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};

  &[data-reach-dialog-content] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};
    width: 423px;
    height: 100%;
    padding: 0;
    margin: 0;

    background: ${({ theme }) => rgba(theme.bg1, 0.99)};
    border-radius: 30px 0 0 30px;
    border-style: solid;
    border-color: ${rgba('#907A99', 0.2)};
    border-width: 1px 0 1px 1px;
    overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};
    overflow-x: hidden;

    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      margin: 0;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width: 85vw;
      ${
        mobile &&
        css`
          width: 100vw;
          border-radius: 20px 20px 0 0;
        `
      }
    `}
  }
`

const Header = styled.div`
  position: relative;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  height: 140px;
`

const Title = styled.span`
  color: ${({ theme }) => theme.text1};
  font-weight: bold;
  font-size: 30px;
  line-height: 37px;
  letter-spacing: 0.02em;
`

const Content = styled.div`
  flex-basis: 510px;
`

const ButtonClose = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  align-self: center;
  height: 45px;
  margin-bottom: 20px;
  padding: 0 40px;

  color: #907a99;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.02em;

  background: transparent;
`

const CloseIconStyled = styled(CloseIcon)`
  margin-top: -1px;
  margin-right: 10px;
`

const easing = BezierEasing(0.7, -0.4, 0.4, 1.4)

export interface SideModalProps {
  title: string | React.ReactNode
  isOpen: boolean
  onDismiss: () => void
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export const SideModal: FC<SideModalProps> = ({ title, isOpen, onDismiss, initialFocusRef, children }) => {
  const config = useMemo(() => {
    if (isMobile) {
      return {
        config: { duration: 600, easing: (t: number) => easing(t) },
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
      }
    }

    return {
      config: { duration: 600, easing: (t: number) => easing(t) },
      from: { transform: 'translateX(422px)' },
      enter: { transform: 'translateX(0)' },
      leave: { transform: 'translateX(422px)' },
    }
  }, [isMobile])

  const fadeTransition = useTransition(isOpen, null, config)

  const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useDrag((state) => {
    set({
      y: state.down ? state.movement[1] : 0,
    })
    if (state.movement[1] > 300 || (state.velocity[1] > 3 && state.direction[1] > 0)) {
      onDismiss()
    }
  })

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay key={key} onDismiss={onDismiss} initialFocusRef={initialFocusRef}>
              <StyledDialogContent
                {...(isMobile
                  ? {
                      ...bind(),
                      style: {
                        ...props,
                        transform: y.interpolate((n) => `translateY(${(n as unknown as number) > 0 ? n : 0}px)`),
                      },
                    }
                  : {
                      style: props,
                    })}
                aria-label="dialog content"
                mobile={isMobile}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                <Header>
                  <Title>{title}</Title>
                </Header>
                <Content>{children}</Content>
                <ButtonClose onClick={onDismiss}>
                  <CloseIconStyled /> Close
                </ButtonClose>
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
