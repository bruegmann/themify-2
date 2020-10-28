import React, { useEffect, useState } from "react";
import { Page, Header, HeaderTitle, Body, Actions, MenuItem, DropdownMenuItem, Utilities } from "blue-react";
import { BoxArrowUp, Share, FileEarmarkPlus, Gear, Brush, FileZip, CloudUpload } from "react-bootstrap-icons"

import { appLogo, appTitle, getPhrase as _ } from "../shared";
import ThemesHome from "../components/ThemesHome";
import ConfigHome from "../components/ConfigHome";
import FileModal from "../components/FileModal";




function HomePage(props: any) {
    const [SelectedThemeConfig, setSelectedThemeConfig] = useState<number>(0);
    const [modalNew, setModalNew] = useState<boolean>(false);
    const [modalSave, setModalSave] = useState<boolean>(false);
    const [themeName, setThemeName] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [valueConfig, setValueConfig] = useState<any>();
    const [valueTheme, setValueTheme] = useState<any>();
    const [hashTheme, setHashTheme] = useState<string>("");

    let files: any = [];

    useEffect(() => {
        if (themeName === "") {
            try {
                let hash = window.location.hash;
                console.log(hash)
                if (hash) {
                    let hashObject = JSON.parse(decodeURIComponent(hash.replace("#/home/", "")));
                    console.log(hashObject)
                    setThemeName(hashObject.name);
                    setAccount(hashObject.account)
                }
                else {
                    setThemeName("Theme Name");
                }

            }
            catch { }
            //Example from Themify (1)
            //console.log(JSON.parse(decodeURIComponent(`%7B"name"%3A"hallo"%2C"btHashVars"%3A%7B"%24theme"%3A"%23923434"%2C"%24fluent-halo-color"%3A"white"%2C"%24shimmering"%3A".9"%7D%7D`)))

        }

    }, [themeName])

    useEffect(() => {
        if (hashTheme) {
            console.log("h")
            setHash();
        }
    }, [hashTheme])


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

    const putFile = async (body: string, file: string) => {
        let response = await fetch(`https://api.github.com/repos/${account}/Themify_DB/contents/Library/${themeName}/${file}`, {
            method: "PUT",
            headers: {
                Authorization: `token ${props.access_token}`,
                "Content-Type": "application/json",
                "Accept": "application/vnd.github.v3+json"
            },
            body: body

        });
        let res = await response.json()
    }

    const editFile = async () => {
        let shaConfig = files.find((o: any) => o.name === "AppSettings.config");
        let shaTheme = files.find((o: any) => o.name === "Theme.json");
        let config = {
            "content": btoa(valueConfig),
            "message": `Update ${themeName} config`,
            "branch": "main",
            "sha": shaConfig.sha
        }

        let json = {
            "content": btoa(valueTheme),
            "message": `Update ${themeName} css`,
            "branch": "main",
            "sha": shaTheme.sha
        }

        await putFile(JSON.stringify(config), "AppSettings.config");
        await putFile(JSON.stringify(json), "Theme.json");

        Utilities.finishLoading();
        Utilities.showSuccess();
        setTimeout(Utilities.hideSuccess, 2000);
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

    const checkFileExist = async () => {
        let response = await fetch(`https://api.github.com/repos/${account}/Themify_DB/contents/Library/${themeName}`, {
            method: "GET",
            headers: {
                Authorization: `token ${props.access_token}`,
                "Content-Type": "application/json",
                "Accept": "application/vnd.github.v3+json"
            }

        });

        let res = await response.json();
        if (response.status === 404) {
            return false;
        }
        else {
            files = res;
            return true;
        }
    }

    const save = async () => {
        Utilities.startLoading();
        if (account !== "" && themeName !== "" && await checkFileExist() === true) {
            editFile();
        }
        else {
            Utilities.finishLoading();
            setModalSave(!modalSave);
        }
    }

    const onChangeThemeHome =  (type: string, value: string) => {
        if (type === "name") {
            setThemeName(value);
        }
        else if (type === "value") {
            console.log(value)
            setValueTheme(value);
        }
        else if (type === "hash") {
             setHashTheme(value);
            //setHash();
        }

    }

    const onChangeConfigHome = (type: string, value: any) => {
        if (type === "name") {
            //setThemeName(value);
        }
        else if (type === "value") {
            setValueConfig(value);
        }
        else if (type === "hash") {
            //setHashTheme(value);
        }
    }

    const setHash = () => {
        console.log(hashTheme)
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
                <MenuItem
                    icon={<CloudUpload />}
                    label={_("SAVE")}
                    onClick={() => save()}
                />
                <MenuItem
                    icon={<CloudUpload />}
                    label={_("SAVE_AS")}
                    onClick={() => setModalSave(!modalSave)}
                />
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
                            <button onClick={() => console.log(hashTheme)}>ccc</button>
                        </div>
                    </div>
                    <hr />
                    <div>
                        {SelectedThemeConfig === 0 ?
                            <ThemesHome
                                name={themeName}
                                value={valueTheme}
                                onChange={(type: string, value: string) => onChangeThemeHome(type, value)}
                            />
                            :
                            <ConfigHome
                                user={props.user}
                                access_token={props.access_token}
                                onChange={(value: string) => onChangeConfigHome("value", JSON.parse(value))}
                            />
                        }
                    </div>
                </div>
                <FileModal
                    keys={0}
                    open={modalNew}
                    onChange={(themename: string, account: string) => changeNewModel(themename, account)}
                    user={props.user}
                    access_token={props.access_token}
                    title={_("CREATE_NEW_THEME")}
                />
                <FileModal
                    keys={1}
                    open={modalSave}
                    user={props.user}
                    onChange={() => setModalSave(!modalSave)}
                    access_token={props.access_token}
                    title={_("SAVE_AS")}
                    contentConfig="test"
                    contentTheme="test22"
                    themeName={themeName}
                    account={account}
                />

            </Body>

        </Page>
    );
}

export default HomePage;