import React, { useEffect, useState } from "react";
import { Grid, SidebarMenu, MenuItem, Utilities } from "blue-react";
import { Brush, List, Collection, Image, FileText, XCircleFill, InfoCircleFill, CheckCircleFill, ExclamationCircleFill, Gear } from "react-bootstrap-icons";
import { getPhrase as _ } from './shared';

//Pages
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import GithubLogin from "./components/GithubLogin";
import SettingsPage from "./pages/SettingsPage";


function App() {

    const [user, setUser] = useState<any>();
    const [access_token, setAccessToken] = useState<string>("");
    const [default_CSS, setdefault_CSS] = useState<any>();
    const [default_Version, setdefault_Version] = useState<any>();


    useEffect(() => {
        if (!default_CSS && !localStorage.getItem("css")) {
            defaultCSS();
        }

        if (!default_Version && !localStorage.getItem("version")) {
            defaultVersion();
        }
    })

    const openBlueDocs = () => {
        window.open("https://bruegmann.github.io/blue-react/", "_blank")
    }

    const defaultCSS = () => {
        fetch((window as any).themify_service + "defaultCss", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(response => {
                setdefault_CSS(response);
            })
    }

    const defaultVersion = () => {
        fetch((window as any).themify_service + "defaultVersion", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(response => {
                setdefault_Version(response);
                localStorage.setItem("version", response);
            })
    }

    return (
        localStorage.getItem("css") || default_CSS ?
            <Grid
                expandSidebar
                sidebarToggleIconComponent={<List />}
                pages={[
                    {
                        name: "home",
                        component:
                            <HomePage
                                user={user}
                                access_token={access_token}
                                defaultCSS={default_CSS}
                            />
                    },
                    {
                        name: "settings",
                        component:
                            <SettingsPage />
                    },
                    {
                        name: "library",
                        component:
                            <LibraryPage
                                user={user}
                                access_token={access_token}
                            />
                    }

                ]}
            >
                <SidebarMenu
                    bottomContent={
                        <>
                            <MenuItem href="#/settings" icon={<Gear />} label="Settings" />
                            <GithubLogin
                                onChange={(usr: any, token: string) => {
                                    setUser(usr);
                                    setAccessToken(token)
                                }}
                            />
                        </>
                    }>
                    <MenuItem href="#/home" icon={<Brush />} label={_("CUSTOMIZER")} isHome />
                    <MenuItem href="#/local-themes" icon={<Image />} label={_("LOCAL_THEME")} />
                    <MenuItem href="#/library" icon={<Collection />} label={_("LIBRARY")} />
                    <MenuItem onClick={() => openBlueDocs()} icon={<FileText />} label={_("BLUE_DOCUMENTATION")} />
                </SidebarMenu>
                <style
                    type="text/css"
                    dangerouslySetInnerHTML={{
                        __html: `${!localStorage.getItem("css") ? default_CSS : JSON.parse(localStorage.getItem("css") as string).cssOutput}`

                    }}
                />
            </Grid>
            :
            <></>
    );
}

export default App;