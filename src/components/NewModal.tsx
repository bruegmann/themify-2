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

    const cancel = () =>{
        setLoad(false);
        props.onChange()
    }

    const createTheme = async () => {
        await setLoad(true);
        console.log("d")
    }
    return (
        <div>
            <Modal isOpen={props.open}>
                <ModalHeader>
                    Create new Theme
                </ModalHeader>
                <ModalBody>
                    <input className="form-control default mb-3" type="text" placeholder="Name" />
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
