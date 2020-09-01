import React from 'react'

import { Page, Header, HeaderTitle, Body } from 'blue-react';
import { appLogo, appTitle, getPhrase as _ } from '../shared';


export default function LocalThemesPage() {
  return (
    <Page>
      <Header>
        <HeaderTitle logo={appLogo} appTitle={appTitle}>Library</HeaderTitle>
      </Header>

      <Body>

      </Body>
    </Page>
  )
}
