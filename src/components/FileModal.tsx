import { Utilities } from 'blue-react';
import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";

export default function FileModal(props: any) {
    const [organizations, setOrganizations] = useState<any>([]);
    const [account, setAccount] = useState<string>("");
    const [load, setLoad] = useState<boolean>(false);
    const [themeName, setThemeName] = useState<string>("");


    let files: any = [];

    useEffect(() => {
        if (props.user && props.access_token) {
            getOrganizations();
        }
    }, [props])

    useEffect(() => {
        if (props.themeName) {
            setThemeName(props.themeName);
        }
    }, [props.themeName])

    useEffect(() => {
        if (props.account) {
            setAccount(props.account);
        }
    }, [props.account])

    useEffect(() => {
        if (props.user && props.keys === 0) {
            setAccount(props.user.login);
        }
    }, [props.user])



    const submit = async () => {
        await setLoad(true);
        if (props.keys === 0) {
            FilesToGithub();
        }
        else if (props.keys === 1) {
            console.log("sace")
        }
    }

    const getOrganizations = async () => {
        const res = await fetch(`${(window as any).proxy}${props.user.organizations_url}`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json"
            }
        });

        await res
            .json()
            .then(async org => {
                setOrganizations(org)
            })
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
            "content": btoa(""),
            "message": `Update ${themeName} config`,
            "branch": "main",
            "sha": shaConfig.sha
        }

        let json = {
            "content": btoa(""),
            "message": `Update ${themeName} css`,
            "branch": "main",
            "sha": shaTheme.sha
        }

        await putFile(JSON.stringify(config), "AppSettings.config");
        await putFile(JSON.stringify(json), "Theme.json");

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
        files = res;
        if (response.status === 404) {
            return false;
        }
        else {
            return true;
        }
    }

    const FilesToGithub = async () => {
        if (await checkFileExist() === true) {
            editFile();
        }
        else {
            try {
                let config = {
                    "content": btoa(""),
                    "message": `Add ${themeName} config`,
                    "branch": "main"
                }
        
                let json = {
                    "content": btoa(""),
                    "message": `Add ${themeName} css`,
                    "branch": "main"
                }

                await putFile(JSON.stringify(config), "AppSettings.config");
                await putFile(JSON.stringify(json), "Theme.json");
                Utilities.showSuccess();
                setTimeout(Utilities.hideSuccess, 2000);

                props.onChange(themeName, account);
            }
            catch {
                Utilities.setAlertMessage("Fehler", "warning", true, "Es konnte kein neues Theme erstellt werden")
            }
        }
    }

    const onChangeAccount = (value: string) => {
        setAccount(value);
    }

    const onChangeThemeName = (e: any) => {
        setThemeName(e.target.value);
    }

    const cancel = () => {
        setLoad(false);
        props.onChange()
    }

    const createRepo = async () => {
        var repo = {
            "name": "Themify_DB",
            "description": "The DB for Themify",
            "homepage": "https://github.com",
            "private": true
        }

        if (props.user.login === account) {
            let response = await fetch(`https://api.github.com/user/repos`, {
                method: "POST",
                headers: {
                    Authorization: `token ${props.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(repo)

            });

            let res = await response.json();
        }
        else {
            let response = await fetch(`https://api.github.com/orgs/${account}/repos`, {
                method: "POST",
                headers: {
                    Authorization: `token ${props.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(repo)

            });

            let res = await response.json();
        }

    }

    const CheckForDBRepo = async () => {
        let response = await fetch(`https://api.github.com/repos/${account}/Themify_DB`, {
            method: "Get",
            headers: {
                Authorization: `token ${props.access_token}`,
                "Content-Type": "application/json"
            }

        });
        let res = await response.json()
        if (response.status === 200) {
            return true;
        }
        else {
            return false;
        }
    }

    const createTheme = async () => {

        if (themeName !== "") {
            if (await CheckForDBRepo() === false) {
                if (window.confirm('Es scheint noch keine Datenbank vorhande zu sein. Wollen sie eine Datenbank erstellen?')) {
                    await createRepo();
                    await FilesToGithub();
                }
                else {

                }
            }
            else {
                await FilesToGithub();
            }
        }
        else {
            alert("Bitte ein Name eingeben")
        }
        await setLoad(false);
    }
    return (
        <div>
            <Modal isOpen={props.open}>
                <ModalHeader>
                    {props.title}
                </ModalHeader>
                <ModalBody>
                    <input className="form-control default mb-3" type="text" placeholder="Name" value={themeName} onChange={onChangeThemeName} />
                    {props.user ?
                        <UncontrolledButtonDropdown>
                            <DropdownToggle caret color="outline-secondary">
                                Account: {account}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => onChangeAccount(props.user.login)}><img className="avatar mr-2" alt={props.user?.login} src={props.user?.avatar_url} />{props.user?.login}</DropdownItem>
                                {
                                    organizations.map((item: any) =>
                                        <DropdownItem onClick={() => onChangeAccount(item.login)}><img className="avatar mr-2" alt={item.login} src={item.avatar_url} />{item.login}</DropdownItem>
                                    )
                                }
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        :
                        <p>Online Speichern nicht möglich. Du musst bei Github angemeldet sein</p>
                    }
                </ModalBody>
                <ModalFooter>
                    {load === false ?
                        <div>
                            <button className="btn btn-outline-danger mr-2" onClick={() => cancel()}>Cancel</button>
                            <button className="btn btn-outline-primary" onClick={() => submit()}>Submit</button>
                        </div>
                        :
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only"></span>
                        </div>
                    }


                </ModalFooter>

            </Modal>
        </div>
    )
}
