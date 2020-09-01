import React from "react";
import { Grid, SidebarMenu, MenuItem } from "blue-react";
import { Brush, List, Collection, Image, FileText } from "react-bootstrap-icons";

import "./styles/main.scss";

//Pages
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import LocalThemesPage from "./pages/LocalThemesPage";

function App() {

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
                    component: <HomePage />
                },
                {
                    name: "local-themes",
                    component: <LocalThemesPage />
                },
                {
                    name: "library",
                    component: <LibraryPage />
                }
            ]}
        >
            <SidebarMenu>
                <MenuItem href="#/home" icon={<Brush />} label="Customizer" isHome />
                <MenuItem href="#/local-themes" icon={<Image />} label="Local Themes" />
                <MenuItem href="#/library" icon={<Collection />} label="Library" />
                <MenuItem onClick={() => openBlueDocs()} icon={<FileText />} label="Blue Documentation" />
            </SidebarMenu>
        </Grid>
    );
}

export default App;