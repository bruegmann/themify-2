import { DropdownMenuItem, MenuItem } from 'blue-react';
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
                <DropdownMenuItem
                    label={user.login}
                    icon={<img style={{ width: "30px", height: "30px" }}
                        className="rounded-circle align-middle mr-2"
                        alt={user.login}
                        src={user.avatar_url}
                    >
                    </img>}
                >
                    <MenuItem
                        onClick={() => {
                            if (localStorage.getItem("access_token")) {
                                localStorage.removeItem("access_token")
                                window.location.reload();
                            }
                        }}
                        label="Logout"
                        icon={
                            <svg
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                className="bi bi-door-closed"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2zm1 13h8V2H4v13z"
                                />
                                <path
                                    d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"
                                />
                            </svg>
                        } />
                </DropdownMenuItem>
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
