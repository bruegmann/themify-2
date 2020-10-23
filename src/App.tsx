import React, { useState } from "react";
import { Grid, SidebarMenu, MenuItem } from "blue-react";
import { Brush, List, Collection, Image, FileText, XCircleFill, InfoCircleFill, CheckCircleFill, ExclamationCircleFill } from "react-bootstrap-icons";

import "./styles/main.scss";

//Pages
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import LocalThemesPage from "./pages/LocalThemesPage";
import GithubLogin from "./components/GithubLogin";


function App() {

    const [user, setUser] = useState<any>();
    const [access_token, setAccessToken] = useState<string>("");

    const openBlueDocs = () => {
        window.open("https://bruegmann.github.io/blue-react/", "_blank")
    }

    return (

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
                        />
                },
                {
                    name: "local-themes",
                    component: <LocalThemesPage />
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
            statusIcons={{
                danger: <XCircleFill />,
                info: <InfoCircleFill />,
                success: <CheckCircleFill />,
                warning: <ExclamationCircleFill />
            }}
        >
            <SidebarMenu
                bottomContent={
                    <>
                        <GithubLogin
                            onChange={(usr: any, token: string) => {
                                setUser(usr);
                                setAccessToken(token)
                            }}
                        />
                    </>
                }>
                <MenuItem href="#/home" icon={<Brush />} label="Customizer" isHome />
                <MenuItem href="#/local-themes" icon={<Image />} label="Local Themes" />
                <MenuItem href="#/library" icon={<Collection />} label="Library" />
                <MenuItem onClick={() => openBlueDocs()} icon={<FileText />} label="Blue Documentation" />
            </SidebarMenu>
        </Grid>
    );
}

export default App;