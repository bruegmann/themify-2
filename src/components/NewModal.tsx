import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import ConfigSection from './ConfigSection';

export default function NewModal(props: any) {
    const [organizations, setOrganizations] = useState<any>([]);
    const [account, setAccount] = useState<string>("");
    const [load, setLoad] = useState<boolean>(false);
    const [themeName, setThemeName] = useState<string>("");

    useEffect(() => {
        if (props.user && props.access_token) {
            getOrganizations();
        }
    }, [props])

    useEffect(() => {
        if (props.user) {
            setAccount(props.user.login);
        }
    }, [props.user])


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

    const createFile = async (body: string, file:string) => {
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
        console.log(res)
    }

    const createAllFiles = async () => {
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
        await createFile(JSON.stringify(config), "AppSettings.config");
        await createFile(JSON.stringify(json) , "Theme.json");
    }

    const onChangeAccount = (value: string) => {
        setAccount(value);
    }

    const onChangeThemeName = (e:any) =>{
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
        await setLoad(true);
        if (await CheckForDBRepo() === false) {
            if (window.confirm('Es scheint noch keine Datenbank vorhande zu sein. Wollen sie eine Datenbank erstellen?')) {
                await createRepo();
            }
            else {

            }
        }

        await createAllFiles();
        await setLoad(false);
    }
    return (
        <div>
            <Modal isOpen={props.open}>
                <ModalHeader>
                    Create new Theme
                </ModalHeader>
                <ModalBody>
                    <input className="form-control default mb-3" type="text" placeholder="Name" onChange={onChangeThemeName}/>
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
                    <button className="btn btn-outline-danger mr-2" onClick={() => cancel()}>Cancel</button>
                    {load === false ?
                        <div>
                            <button className="btn btn-outline-primary" onClick={() => createTheme()}>Submit</button>
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
