import React from 'react'

import GitHubLogin from 'react-github-login';

import GithubIcon from "../icons/GitHub";

import superagent from "superagent";


export default function GithubLogin() {

    const Login = async (code: string) => {
        console.log(code)
       await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json",
              
            } ,
            body: JSON.stringify({
                client_id: "6ab44e0352f595edf63e",
                client_secret: "b1ebee004cc141cef47e2e68e91e530571b5c143",
                code: code
            })           
        })
           .then(res => console.log(res))
    }

    return (
        <div>
            <GitHubLogin
                className="btn btn-primary"
                clientId="6ab44e0352f595edf63e"
                redirectUri="http://localhost:3000"
                scope={['user', 'repo']}
                buttonText={<p className="m-0"> <GithubIcon /> Github Login</p>}
                onSuccess={(response: any) => { Login(response.code) }}
            />
        </div>
    )
}
