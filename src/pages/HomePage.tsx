import React, { useEffect, useState } from "react";
import { Page, Header, HeaderTitle, Body, Actions, MenuItem, DropdownMenuItem } from "blue-react";
import { BoxArrowUp, Collection, Share, FileEarmarkPlus, Gear, Brush, Sim, FileZip } from "react-bootstrap-icons"

import { appLogo, appTitle, getPhrase as _ } from "../shared";
import ThemesHome from "../components/ThemesHome";
import ConfigHome from "../components/ConfigHome";
import NewModal from "../components/NewModal";




function HomePage(props: any) {

    const [SelectedThemeConfig, setSelectedThemeConfig] = useState<number>(1);
    const [modalNew, setModalNew] = useState<boolean>(false);
    const [themeName, setThemeName] = useState<string>("");
    const [saveAcount, setSaveAccount] = useState<string>("");

    useEffect(() => {
        if (themeName === "") {
            let hash = window.location.hash;
            console.log(hash)
            if (hash) {
                let hashObject = JSON.parse(decodeURIComponent(hash.replace("#/home/", "")));
                console.log(hashObject)
                setThemeName(hashObject.name);
                setSaveAccount(hashObject.account)
            }
            else {
                setThemeName("Theme Name");
            }
            //Example from Themify (1)
            //console.log(JSON.parse(decodeURIComponent(`%7B"name"%3A"hallo"%2C"btHashVars"%3A%7B"%24theme"%3A"%23923434"%2C"%24fluent-halo-color"%3A"white"%2C"%24shimmering"%3A".9"%7D%7D`)))

        }

    }, [themeName])


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


    const changeNewModel = (themename: string, account: string) => {
        if (themename && account) {
            var url = {
                name: themename,
                account: account
            }

            window.location.hash = "/home/" + encodeURIComponent(JSON.stringify(url));
            window.location.reload();
        }
        else {
            setModalNew(!modalNew)
        }
    }


    return (
        <Page hasActions={true} >
            <Header>
                <HeaderTitle logo={appLogo} appTitle={appTitle}>{_("CUSTOMIZER")}</HeaderTitle>
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
                    onClick={() => setModalNew(!modalNew)}
                />
            </Actions>

            <Body className="pl-5 pr-5">
                <div id="homePage">
                    <div className="row mt-3 d-flex justify-content-center">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className={"btn " + getClassSelectedThemeConfig(0)} onClick={() => { setSelectedThemeConfig(0) }}><Brush /> {_("THEME")}</button>
                            <button type="button" className={"btn " + getClassSelectedThemeConfig(1)} onClick={() => { setSelectedThemeConfig(1) }}><Gear /> {_("CONFIG")}</button>
                        </div>
                    </div>
                    <hr />
                    <div>
                        {SelectedThemeConfig === 0 ?
                            <ThemesHome
                                name={themeName}
                                onChange={(value: string) => setThemeName(value)}
                            />
                            :
                            <ConfigHome
                                user={props.user}
                                access_token={props.access_token}
                            />
                        }
                    </div>
                </div>
                <NewModal
                    open={modalNew}
                    onChange={(themename: string, account: string) => changeNewModel(themename, account)}
                    user={props.user}
                    access_token={props.access_token}
                />


            </Body>
        </Page >
    );
}

export default HomePage;