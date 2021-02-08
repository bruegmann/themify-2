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
    const [SelectedThemeConfig, setSelectedThemeConfig] = useState<number>(0);
    const [modalNew, setModalNew] = useState<boolean>(false);
    const [modalSave, setModalSave] = useState<boolean>(false);
    const [themeName, setThemeName] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [valueConfig, setValueConfig] = useState<string>("");
    const [valueTheme, setValueTheme] = useState<string>("");
    const [defaultTemplate, setDefaultTemplate] = useState<any>();
    const [hashTheme, setHashTheme] = useState<string>("");
    const [temphash, setTemphash] = useState<string>("");
    const [load, setLoad] = useState<boolean>(false);

    const [valueConf, setValueConf] = useState<any>({});

    let tempConfig: any;

    let files: any = [];
    let templateFiles: any = [];


    useEffect(() => {
        setTemphash(window.location.hash);
    })

    useEffect(() => {
        if (temphash === "") {
            setLoad(true);
        }
        else {
            let reloadHash = temphash.replace("#/home/", "");
            let hashObject = JSON.parse(decodeURIComponent(reloadHash));
            if (Object.keys(hashObject.config).length > 0) {
                setValueConf(hashObject.config);
            }

            if (Object.keys(hashObject.theme).length > 0) {
                setValueTheme(hashObject.theme);
            }

            setLoad(true);

        }
    }, [temphash])


    useEffect(() => {

        if (themeName === "") {
            try {
                let hash = window.location.hash;
                hash.replace("#/home/", "")
                if (hash != "") {
                    let hashObject = JSON.parse(decodeURIComponent(hash));
                    setThemeName(hashObject.name);
                    setAccount(hashObject.account)
                }
                else {
                    setThemeName("Theme Name");
                }

            }
            catch { }
        }


    }, [themeName])

    useEffect(() => {
        if (props.user !== "") {
            setAccount(props.user?.login)
            if (account !== "") {
                const func = async () => {

                    if (await checkConfigTemplateExist() === false) {
                        // await configTemplate();
                    } else {
                        await getTemplateContent();
                    }

                }
                func();

            }
        }
    }, [props])



   












    useEffect(() => {
        changeHash()
    }, [valueTheme])

    useEffect(() => {
        changeHash()
    }, [valueConf])

    const changeHash = () => {
        if (load === true) {
            window.location.hash = "/home/" + encodeURIComponent(JSON.stringify({ "name": themeName, "account": account, "theme": valueTheme, "config": valueConf }))
        }
    }


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

        const res = await fetch(`${(window as any).themify_service}https://api.github.com/repos/${org}/Themify_DB/contents/Library/${themeName}`, {
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

                const response = await fetch(`${(window as any).themify_service}https://api.github.com/repos/${org}/Themify_DB/contents/${array[i].path}`, {
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

                const response = await fetch(`${(window as any).themify_service}https://api.github.com/repos/${org}/Themify_DB/contents/${array[i].path}`, {
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

            const get = await fetch(`${(window as any).themify_service}https://api.github.com/repos/${org}/Themify_DB/contents/${arr1[k].path}`, {
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

            const get = await fetch(`${(window as any).themify_service}https://api.github.com/repos/${org}/Themify_DB/contents/${arr2[j].path}`, {
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

    // const configTemplate = async () => {
    //     try {
    //         let configTemplate = templateFiles.find((o: any) => o.name === "themify-library-template.json");


    //         let json = {
    //             "content": btoa(JSON.stringify(content)),
    //             "message": `Added themify-library-template config`,
    //             "branch": "main",
    //         }

    //         await putConfigTemplate(JSON.stringify(json), "themify-library-template.json");

    //         Utilities.finishLoading();
    //         Utilities.showSuccess();
    //         setTimeout(Utilities.hideSuccess, 2000);
    //         window.location.reload();

    //     }
    //     catch {
    //         Utilities.setAlertMessage("Fehler", "warning", true, "Es konnte kein default Theme erstellt werden")
    //     }

    // }

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
        // if (account !== "" && account !== undefined) {
        //     const get = await fetch(`${(window as any).themify_proxy}https://api.github.com/repos/${account}/Themify_DB/contents/LibraryTemplate/themify-library-template.json`, {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Accept": "application/json",
        //             "Authorization": `token ${props.access_token}`
        //         }
        //     })
        //         .then((res: any) => {
        //             return res.json();
        //         })
        //         .then((response: any) => {
        //           //  console.log(response)
        //             setDefaultTemplate({
        //                 org: "Brügmann",
        //                 content: atob(response.content)
        //             })
        //         })
        // }

    }

    const editFile = async () => {
        let shaConfig = files.find((o: any) => o.name === "AppSettings.config");
        let shaTheme = files.find((o: any) => o.name === "Theme.json");
        let config = {
            "content": btoa(JSON.stringify(valueConf)),
            "message": `Update ${themeName} config`,
            "branch": "main",
            "sha": shaConfig.sha
        }

        let jsonContent = {
            "name": themeName,
            "link": hashTheme
        }

        let json = {
            "content": btoa(JSON.stringify(jsonContent)),
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

    const onChangeThemeHome = async (type: string, value: any) => {
        if (value) {
            if (type === "name") {
                setThemeName(value);
            }
            else if (type === "value") {
                setValueTheme(value);
                changeHash();
            }
        }
    }

    const onChangeConfigHome = (type: string, value: any) => {
        if (Object.keys(value).length > 0) {
            if (type === "name") {
                setThemeName(value);
            }
            else if (type == "config") {
                setValueConf(value);
                changeHash();
            }
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
                                value={valueTheme}
                                onChange={(type: string, value: any) => onChangeThemeHome(type, value)}
                            />
                            :
                            <ConfigHome
                                user={props.user}
                                access_token={props.access_token}
                                defaultTemplate={defaultTemplate}
                                config={valueConf}
                                onChange={(value: string, type?: string) => onChangeConfigHome(type ? type : "value", JSON.parse(value))}
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
                    contentConfig={JSON.stringify(valueConf)}
                    contentTheme={JSON.stringify({ "name": themeName, "link": hashTheme })}
                    themeName={themeName}
                    account={account}
                />

            </Body>

        </Page>
    );
}

export default HomePage;