import React, { useState } from "react";
import { Page, Header, HeaderTitle, Body, Actions, MenuItem, DropdownMenuItem } from "blue-react";
import { BoxArrowUp, Collection, Share, FileEarmarkPlus, Gear, Brush, Sim, FileZip } from "react-bootstrap-icons"

import { appLogo, appTitle, getPhrase as _ } from "../shared";
import ThemesHome from "../components/ThemesHome";
import ConfigHome from "../components/ConfigHome";




function HomePage(props: any) {

    const [SelectedThemeConfig, setSelectedThemeConfig] = useState<number>(1);

    const getClassSelectedThemeConfig = (value: number) => {
        if (value === SelectedThemeConfig) {
            return "btn-primary"
        }
        else {
            return "btn-outline-primary"
        }
    }

    const saveFileToZip = () => {

    }



    return (
        <Page hasActions={true} >
            <Header>
                <HeaderTitle logo={appLogo} appTitle={appTitle}>Customizer</HeaderTitle>
            </Header>



            <Actions break="xl">
                {/*  <MenuItem
                    icon={<BoxArrowInDown />}
                    label={_("IMPORT_CONFIG")}
              />*/}
                <DropdownMenuItem
                    icon={<BoxArrowUp />}
                    label={_("EXPORT")}
                >
                    <MenuItem
                        icon={<FileZip />}
                        label={_("EXPORT_ZIP")}
                        onClick={() => saveFileToZip()}
                    />
                </DropdownMenuItem>
                <DropdownMenuItem
                    icon={<Collection />}
                    label={_("SAVE_TO_LIB")}
                >
                    <MenuItem
                        icon={<Sim />}
                        label={_("SAVE_THEME_LOCAL")}
                    />
                </DropdownMenuItem>
                <MenuItem
                    icon={<Share />}
                    label={_("SHARE_THIS_CONFIG")}
                />
                <MenuItem
                    icon={<FileEarmarkPlus />}
                    label={_("NEW")}
                />
            </Actions>

            <Body className="pl-5 pr-5">
                <div id="homePage">
                    <div className="row mt-3 d-flex justify-content-center">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className={"btn " + getClassSelectedThemeConfig(0)} onClick={() => { setSelectedThemeConfig(0) }}><Brush /> Theme</button>
                            <button type="button" className={"btn " + getClassSelectedThemeConfig(1)} onClick={() => { setSelectedThemeConfig(1) }}><Gear /> Config</button>
                        </div>
                    </div>
                    <hr />
                    <div>
                        {SelectedThemeConfig === 0 ?
                            <ThemesHome />
                            :
                            <ConfigHome
                                user={props.user}
                                access_token={props.access_token}
                            />
                        }
                    </div>
                </div>


            </Body>
        </Page >
    );
}

export default HomePage;