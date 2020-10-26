import React, { useState, useEffect } from 'react'
import { Page, Header, HeaderTitle, Body } from 'blue-react';
import { appLogo, appTitle, getPhrase as _ } from '../shared';


import LibraryNoLogin from '../components/LibraryNoLogin';
import LibraryLogin from '../components/LibraryLogin';

export default function LibraryPage(props: any) {

    const [showPage, setShowPage] = useState<Boolean>(false);

    useEffect(() => {
        if (props.user) {
            setShowPage(true);
        }
    }, [props.user])


    return (
        <Page>
            <Header>
                <HeaderTitle logo={appLogo} appTitle={appTitle}>{_("LIBRARY")}</HeaderTitle>
            </Header>
            <Body>
                {showPage === true ?
                    <div>
                        <LibraryLogin
                            user={props.user}
                            access_token={props.access_token}
                        />
                    </div>
                    :
                    <div>
                        <LibraryNoLogin />
                    </div>
                }
            </Body>
        </Page>
    )
}
