import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";

export default function NewModal(props: any) {
    const [organizations, setOrganizations] = useState<any>([]);
    const [account, setAccount] = useState<string>("");
    const [load, setLoad] = useState<boolean>(false);

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
        console.log(props.user)
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

    const onChangeAccount = (value: string) => {
        setAccount(value);
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
            console.log(res)
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
            console.log(res)
        }

    }

    const CheckForDBRepo = async () => {
        if (props.user.login === account) {
            let response = await fetch(`https://api.github.com/repos/${account}/Themify_DB`, {
                method: "Get",
                headers: {
                    Authorization: `token ${props.access_token}`,
                    "Content-Type": "application/json"
                }

            });

            if (response.status === 200) {
                return true;
            }
            else {
                return false;
            }
        }
        else {

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
        await setLoad(false);
    }
    return (
        <div>
            <Modal isOpen={props.open}>
                <ModalHeader>
                    Create new Theme
                </ModalHeader>
                <ModalBody>
                    <input className="form-control default mb-3" type="text" placeholder="Name" />
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
