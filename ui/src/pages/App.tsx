import { DappKitResponseStatus } from '@celo/utils'
import { ErrorBoundary } from '@sentry/react'
import { PoweredBy } from 'components/common/PoweredBy'
import React, { Suspense } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import GoogleAnalyticsReporter from '../components/common/_old/analytics/GoogleAnalyticsReporter'
import Popups from '../components/common/_old/Popups'
import { Header } from '../components/common/Header'
import { Polling } from '../components/common/Polling'
import { URLWarning } from '../components/common/URLWarning'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import { getMobileOperatingSystem, Mobile } from '../utils/mobile'
import Swap from './_old/Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToTradeOnly, RedirectToSwap } from './_old/Swap/redirects'
import { Trade } from './trade'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  min-height: 100vh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const localStorageKey = 'valoraRedirect'

export default function App() {
  const location = useLocation()

  React.useEffect(() => {
    // Close window if search params from Valora redirect are present (handles Valora connection issue)
    if (typeof window !== 'undefined') {
      const url = window.location.href
      const whereQuery = url.indexOf('?')
      if (whereQuery !== -1) {
        const query = url.slice(whereQuery)
        const params = new URLSearchParams(query)
        if (params.get('status') === DappKitResponseStatus.SUCCESS) {
          localStorage.setItem(localStorageKey, window.location.href)
          const mobileOS = getMobileOperatingSystem()
          if (mobileOS === Mobile.ANDROID) {
            window.close()
          }
        }
      }
    }
  }, [location])

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <ErrorBoundary fallback={<p>An unexpected error occured on this part of the page. Please reload.</p>}>
            <Switch>
              <Route exact strict path="/trade" component={Trade} />
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              {/*<Route exact strict path="/send" component={Send} />*/}
              {/*<Route exact strict path="/find" component={PoolFinder} />*/}
              {/*<Route exact strict path="/pool" component={Pool} />*/}
              {/*<Route exact strict path="/create" component={RedirectToAddLiquidity} />*/}
              {/*<Route exact path="/add" component={AddLiquidity} />*/}
              {/*<Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />*/}
              {/*<Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />*/}
              {/*<Route exact path="/create" component={AddLiquidity} />*/}
              {/*<Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />*/}
              {/*<Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />*/}
              {/*<Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />*/}
              {/*<Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />*/}
              {/*<Route exact strict path="/farm" component={Earn} />*/}
              {/*<Route exact strict path="/farm/:currencyIdA/:currencyIdB/:stakingAddress" component={Manage} />*/}
              {/*<Route exact strict path="/dualfarm/:currencyIdA/:currencyIdB/:stakingAddress" component={Manage} />*/}
              {/*<Route exact strict path="/Bridge" component={Bridge} />*/}
              <Route component={RedirectPathToTradeOnly} />
            </Switch>
          </ErrorBoundary>
          <PoweredBy />
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
