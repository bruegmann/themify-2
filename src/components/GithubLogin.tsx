import React, { useState, useEffect } from 'react'
import { Utilities } from "blue-react";
import { getPhrase as _ } from '../shared';
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

    const ErrorLogin = () => {
        Utilities.setAlertMessage("Fehler beim Anmelden", "danger", true, "Es konnte keine Verbindung mit Github aufgebaut werden")
    }

    const Login = (acces_token: string) => {
        (window as any).access_token = acces_token;
        localStorage.setItem("access_token", acces_token);

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
            .catch(() => { ErrorLogin() })
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
                        clientId="48bc2750433ca7444fa7"
                        redirectUri=""
                        onSuccess={async ({ code }: { code: string }) => {
                            try {
                                const res = await fetch(`${(window as any).oauth}?code=${code}`);
                                const access = await res.json()
                                Login(access.access_token);
                            }
                            catch (error) {
                                ErrorLogin();
                            }
                        }}
                        onFailure={() => ErrorLogin()}
                        scope={['user', 'repo', 'write:org']}
                        buttonText={<p className="m-0"> <GithubIcon /> {_("LOGIN_WITH_GITHUB")}</p>}
                    />
                </div>
            }
        </div>
    )
}
