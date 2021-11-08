import {
  Connector,
  Provider,
  PROVIDERS,
  SupportedProviders,
  useContractKit,
  useContractKitInternal,
} from '@celo-tools/use-contractkit'
import { defaultScreens } from '@celo-tools/use-contractkit/lib/screens'
import { SideModal } from 'components/common/SideModal'
import useUpdateEffect from 'hooks/react/useUpdateEffect'
import { rgba } from 'polished'
import React, { FC, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ApplicationModal } from '../../../state/application/actions'
import { useCloseModals, useModalOpen } from '../../../state/application/hooks'
import { ProviderButton } from './common/styled'
import { ProviderSelect } from './ProviderSelect'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ProviderButtonMore = styled(ProviderButton)`
  justify-content: center;

  background: ${({ theme }) => rgba(theme.white, 0.02)};
`

const ScreenWrapper = styled.div`
  padding: 2rem;

  background: #fff;
  border-radius: 20px;
`

export const SideModalWallet: FC = () => {
  const { connectionCallback } = useContractKitInternal()
  const { address: wallet } = useContractKit()
  const isOpen = useModalOpen(ApplicationModal.SELECT_WALLET)
  const closeModals = useCloseModals()

  const [showMore, setShowMore] = useState(false)
  const [adding, setAdding] = useState<SupportedProviders | null>(null)

  useUpdateEffect(() => {
    if (wallet) {
      closeModals()
    }
  }, [wallet])

  // useUpdateEffect(() => {
  //   if (!wallet) {
  //     connectCall()
  //   }
  // }, [wallet])
  //
  // function connectCall() {
  //   connect().catch((err) => {
  //     console.error('Wallet connect: ', err)
  //   })
  // }

  const handleSubmit = useCallback(
    (connector: Connector): void => {
      setAdding(null)
      connectionCallback?.(connector)
    },
    [connectionCallback]
  )

  const handleDismiss = useCallback((): void => {
    if (adding) {
      setAdding(null)
      return
    }

    closeModals()
  }, [adding, closeModals])

  const providers = useMemo<[providerKey: string, provider: Provider][]>(
    () =>
      Object.entries(PROVIDERS).filter(
        ([, provider]) =>
          typeof window !== 'undefined' &&
          provider.showInList() &&
          Object.keys(defaultScreens).find((screen) => screen === provider.name)
      ),
    []
  )
  const prioritizedProviders = useMemo<[providerKey: string, provider: Provider][]>(
    () => providers.filter(([, provider]) => provider.listPriority() === 0),
    [providers]
  )

  let modalContent
  if (!adding) {
    const providersToDisplay = showMore ? providers : prioritizedProviders
    modalContent = (
      <>
        {providersToDisplay.map(([providerKey, provider]) => (
          <ProviderSelect
            key={providerKey}
            provider={provider}
            onClick={() => setAdding(providerKey as SupportedProviders)}
          />
        ))}
        {!showMore ? <ProviderButtonMore onClick={() => setShowMore(true)}>Show more</ProviderButtonMore> : null}
      </>
    )
  } else {
    const ProviderElement = defaultScreens?.[adding]
    if (!ProviderElement) {
      return null
    }
    modalContent = (
      <ScreenWrapper>
        <ProviderElement onSubmit={handleSubmit} />
      </ScreenWrapper>
    )
  }

  return (
    <SideModal title="Wallet" isOpen={isOpen} onDismiss={handleDismiss}>
      <Content>{modalContent}</Content>
    </SideModal>
  )
}
