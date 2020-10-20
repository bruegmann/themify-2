import React, { useState, useEffect } from 'react'

import GitHubLogin from 'react-github-login';

import GithubIcon from "../icons/GitHub";


export var GithubUserContext = React.createContext("das dfgigh")


export default function GithubLogin(props: any) {

    const [user, setUser] = useState<any>();


    useEffect(() => {
        if (user == null) {
            var access_toke = localStorage.getItem("access_token");

            if (access_toke) {
                Login(access_toke);
            }
        }
    })

    const getAccessToken = async (code: string) => {
        var gitHubOauthUrl = "http://localhost:4000/login/oauth/access_token"
        fetch(`${gitHubOauthUrl}?code=${code}`)
            .then(res => res.json())
            .then(data => {
                //localStorage.setItem("access_token", data.acces_token);
                Login(data.access_token);
            })

        // fetch(`${(window as any).proxy}https://github.com/login/oauth/access_token`, {
        //     method: "POST",
        //     headers: {
        //         "Accept": "application/json",
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         client_id: "6ab44e0352f595edf63e",
        //         client_secret: "b1ebee004cc141cef47e2e68e91e530571b5c143",
        //         code
        //     })
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         //localStorage.setItem("access_token", data.acces_token);
        //         Login(data.access_token);
        //     })
    }

    const Login = (acces_token: string) => {
        (window as any).access_token = acces_token;

        fetch(`${(window as any).proxy}https://api.github.com/user`, {
            headers: {
                Authorization: `token ${acces_token}`,
                method: "get",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                setUser(data);
                props.onChange(data, acces_token);
                (window as any).githubuser = data;
            })
    }

    return (
        <div>
            {user ?
                <div className="blue-app-toggle-page blue-app-sidebar-btn btn blue-app-sidebar-dropdown-toggle has-label">
                    <img className="avatar mr-2" alt={user.login} src={user.avatar_url} ></img>
                    {user.login}
                </div>
                :
                <div>
                    <GitHubLogin
                        className="blue-app-toggle-page blue-app-sidebar-btn btn blue-app-sidebar-dropdown-toggle has-label btghlogin"
                        clientId="6ab44e0352f595edf63e"
                        redirectUri=""
                        onSuccess={async ({ code }: { code: string }) => {
                            const res = await fetch(`${(window as any).oauth}?code=${code}`)
                            const access = await res.json();
                            Login(access.access_token);
                        }}
                        onFailure={(response: any) => console.error(response)}
                        scope={['user', 'repo']}
                        buttonText={<p className="m-0"> <GithubIcon /> Login mit Github</p>}
                    />
                </div>
            }
        </div>
    )
}
