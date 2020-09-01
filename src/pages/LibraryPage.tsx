import React from 'react'
import { Page, Header, HeaderTitle, Body, Actions, MenuItem } from 'blue-react';
import { appLogo, appTitle, getPhrase as _ } from '../shared';


export default function LibraryPage() {

    const Login = () => {
        fetch("https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/authorize", {
            headers: {
                method: "GET",
                "client_id": "6ab44e0352f595ed3e",
                "redirect_uri": "http://localhost:3000/#/library",
                "Content-Type": "application/json",
                "scope": "user"
            }
        })
            .then(response => console.log(response))
    }

    return (
        <Page>
            <Header>
                <HeaderTitle logo={appLogo} appTitle={appTitle}>Library</HeaderTitle>
            </Header>

            <Actions>
                <MenuItem
                    onClick={() => Login()}
                    label="Login Github"
                />
            </Actions>


            <Body>
            </Body>
        </Page>
    )
}
