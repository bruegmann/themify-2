import React, { useEffect, useState } from "react";
import { Page, Header, HeaderTitle, Body, Actions, MenuItem, DropdownMenuItem, Utilities } from "blue-react";
import { BoxArrowUp, Share, FileEarmarkPlus, Gear, Brush, FileZip, CloudUpload } from "react-bootstrap-icons"

import { appLogo, appTitle, getPhrase as _ } from "../shared";
import ThemesHome from "../components/ThemesHome";
import ConfigHome from "../components/ConfigHome";
import FileModal from "../components/FileModal";
import JSZip from "jszip";
import { saveAs } from 'file-saver';




function HomePage(props: any) {

    const [SelectedThemeConfig, setSelectedThemeConfig] = useState<number>(1);
    const [modalNew, setModalNew] = useState<boolean>(false);
    const [modalSave, setModalSave] = useState<boolean>(false);
    const [themeName, setThemeName] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [valueConfig, setValueConfig] = useState<string>("");
    const [valueTheme, setValueTheme] = useState<string>("");
    const [defaultTemplate, setDefaultTemplate] = useState<any>();

    let files: any = [];
    let templateFiles: any = [];

    useEffect(() => {
        if (themeName === "") {
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
            //Example from Themify (1)
            //console.log(JSON.parse(decodeURIComponent(`%7B"name"%3A"hallo"%2C"btHashVars"%3A%7B"%24theme"%3A"%23923434"%2C"%24fluent-halo-color"%3A"white"%2C"%24shimmering"%3A".9"%7D%7D`)))

        }

    }, [themeName])

    useEffect(() => {
        if (props.user !== "") {
            setAccount(props.user?.login)
            if (account !== "") {
                const func = async () => {

                    if (await checkConfigTemplateExist() === false) {
                        await configTemplate();
                    } else {
                        await getTemplateContent();
                    }

                }
                func();

            }
        }
    }, [props])


    const getClassSelectedThemeConfig = (value: number) => {
        if (value === SelectedThemeConfig) {
            return "btn-primary"
        }
        else {
            return "btn-outline-primary"
        }
    }


    const saveFileToZip = async (org: any) => {

        let array: any;

        const res = await fetch(`${(window as any).themify_proxy}https://api.github.com/repos/${org}/Themify_DB/contents/Library/${themeName}`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json"
            }
        });

        await res
            .json()
            .then(res => {
                array = res;
            })

        var zip = new JSZip();

        let arr1: any = [];
        let arr2: any = [];
        let folder: any;

        for (let i = 0; i < array.length; i++) {

            if (array[i].type === "dir") {

                folder = zip.folder(array[i].name);

                const response = await fetch(`${(window as any).themify_proxy}https://api.github.com/repos/${org}/Themify_DB/contents/${array[i].path}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `token ${props.access_token}`
                    }
                })
                    .then((res: any) => {
                        return res.json()
                    })
                    .then((resp: any) => {
                        if (resp.length >= 0) {
                            for (let a = 0; a < resp.length; a++) {
                                arr1.push(resp[a]);
                            }
                        }
                    })

            }
            else {

                const response = await fetch(`${(window as any).themify_proxy}https://api.github.com/repos/${org}/Themify_DB/contents/${array[i].path}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `token ${props.access_token}`
                    }
                })
                    .then((res: any) => {
                        return res.json()
                    })
                    .then((resp: any) => {
                        arr2.push(resp);
                    })

            }
        }

        for (let k = 0; k < arr1.length; k++) {

            const get = await fetch(`${(window as any).themify_proxy}https://api.github.com/repos/${org}/Themify_DB/contents/${arr1[k].path}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `token ${props.access_token}`
                }
            })
                .then((res: any) => {
                    return res.json();
                })
                .then((response: any) => {
                    folder.file(response.name, atob(response.content))
                })

        }

        for (let j = 0; j < arr2.length; j++) {

            const get = await fetch(`${(window as any).themify_proxy}https://api.github.com/repos/${org}/Themify_DB/contents/${arr2[j].path}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `token ${props.access_token}`
                }
            })
                .then((res: any) => {
                    return res.json();
                })
                .then((response: any) => {
                    zip.file(response.name, atob(response.content))
                })

        }

        if (Object.keys(zip.files).length > 1) {
            await zip.generateAsync({ type: "blob" }).then((content: any) => {
                saveAs(content, `${themeName}.zip`);
            })
        }
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

    const configTemplate = async () => {
        try {
            let configTemplate = templateFiles.find((o: any) => o.name === "themify-library-template.json");

            const content = [
                {
                    "name": "InventorReportsId",
                    "default": "",
                    "type": "number",
                    "description": "ID of the form that should be used for inventor reports. Set \"0\" to disable inventor reports."
                },
                {
                    "name": "OpenSearchUri",
                    "default": "",
                    "type": "uri"
                },
                {
                    "name": "CssFilePath",
                    "default": "themes/default.css",
                    "type": "file",
                    "description": "Overwrites default theme"
                },
                {
                    "name": "HeaderLogo",
                    "default": "ipm.svg",
                    "type": "file",
                    "description": "Logo on the top left in the header"
                },
                {
                    "name": "IntroLogo",
                    "default": "ipm.svg",
                    "type": "file",
                    "description": "Logo on the sign in screen"
                },
                {
                    "name": "IntroLogoMaxWidth",
                    "default": "100px",
                    "type": "size",
                    "description": "Maximum width for the intro logo"
                },
                {
                    "name": "SiteName",
                    "default": "PatOrg",
                    "type": "string",
                    "description": "Will be shown on the title bar and on the header of the site"
                },
                {
                    "name": "IntroWelcomeText",
                    "default": "WELCOME_TO_PATORG",
                    "type": "string",
                    "description": "Introduction text on the sign in screen"
                },
                {
                    "name": "ShowDynamicStartHeader",
                    "default": "true",
                    "type": "boolean",
                    "description": "Enables dynamic header information on the start page"
                },
                {
                    "name": "StartWelcomeText",
                    "default": "WELCOME_TO_PATORG",
                    "type": "string",
                    "description": "Introduction text on the start page"
                },
                {
                    "name": "StartLeadingText",
                    "default": "",
                    "type": "string",
                    "description": "Leading text on the start page"
                },
                {
                    "name": "StartLogoLeft",
                    "default": "",
                    "type": "string",
                    "description": "Logo on the left of the start page"
                },
                {
                    "name": "StartLogoRight",
                    "default": "",
                    "type": "string",
                    "description": "Logo on the right of the start page"
                },
                {
                    "name": "StartJumbotronColor",
                    "default": "",
                    "type": "color",
                    "description": "Text color for the introduction component on the start page"
                },
                {
                    "name": "StartJumbotronBg",
                    "default": "",
                    "type": "color",
                    "description": "Background color for the introduction component on the start page"
                },
                {
                    "name": "Favicon",
                    "default": "",
                    "type": "file",
                    "description": "Icon shown by the browser"
                },
                {
                    "name": "HideFilterOptions",
                    "default": "false",
                    "type": "boolean",
                    "description": "Hides options on filters"
                },
                {
                    "name": "HideFilterChangeInputFields",
                    "default": "false",
                    "type": "boolean",
                    "description": "Disables the ability to change the input fields in filters"
                },
                {
                    "name": "HideSettingsPage",
                    "default": "false",
                    "type": "boolean",
                    "description": "Hides the settings page from the menu"
                },
                {
                    "name": "HideMenuSearch",
                    "default": "false",
                    "type": "boolean",
                    "description": "Hides menu search on the start page"
                },
                {
                    "name": "HideEmptyFields",
                    "default": "false",
                    "type": "boolean"
                },
                {
                    "name": "DefaultUrlRoot",
                    "default": "~",
                    "type": "pnpm staath"
                },
                {
                    "name": "AllowIpmUpload",
                    "default": "false",
                    "type": "boolean"
                },
                {
                    "name": "Search",
                    "default": "true",
                    "type": "boolean"
                }
            ] as any[];
            let json = {
                "content": btoa(JSON.stringify(content)),
                "message": `Added themify-library-template config`,
                "branch": "main",
            }

            await putConfigTemplate(JSON.stringify(json), "themify-library-template.json");

            Utilities.finishLoading();
            Utilities.showSuccess();
            setTimeout(Utilities.hideSuccess, 2000);
            window.location.reload();

        }
        catch {
            Utilities.setAlertMessage("Fehler", "warning", true, "Es konnte kein default Theme erstellt werden")
        }

    }

    const putConfigTemplate = async (body: string, file: string) => {
        let response = await fetch(`https://api.github.com/repos/${account}/Themify_DB/contents/LibraryTemplate/${file}`, {
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

    const checkConfigTemplateExist = async () => {
        if (account !== "" && account !== undefined) {
            let response = await fetch(`https://api.github.com/repos/${account}/Themify_DB/contents/LibraryTemplate`, {
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
                templateFiles = res;
                return true;
            }
        }
    }

    const getTemplateContent = async () => {
        if (account !== "" && account !== undefined) {
            const get = await fetch(`${(window as any).themify_proxy}https://api.github.com/repos/${account}/Themify_DB/contents/LibraryTemplate/themify-library-template.json`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `token ${props.access_token}`
                }
            })
                .then((res: any) => {
                    return res.json();
                })
                .then((response: any) => {
                    console.log(response)
                    setDefaultTemplate({
                        org: "Brügmann",
                        content: atob(response.content)
                    })
                })
        }

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
                        onClick={() => saveFileToZip(props.user.login)}
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
                                defaultTemplate={defaultTemplate}
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
        </Page >
    );
}

export default HomePage;