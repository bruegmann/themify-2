import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { TrashFill } from "react-bootstrap-icons"
import { Utilities } from 'blue-react'

export default function ThemeItem(props: any) {
    useEffect(() => {
        if (delItems) {
            del(delItems, props.username)
        }
    })

    const [primary, setPrimary] = useState<string>("#ddd")
    const [delItems, setDelItems] = useState<any[]>()

    const deleteFile = async (username: any, name: any) => {
        const res = await fetch(`${(window as any).proxy}https://api.github.com/repos/${username}/Themify_DB/contents/Library/${name}`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json",
            }
        });

        await res
            .json()
            .then((res: any) => {
                setDelItems(res);
            })
    }

    const del = async (res: any, username: any) => {
        Utilities.startLoading();
        for (let i = 0; i < res.length; i++) {
            const dele = await fetch(`${(window as any).themify_proxy}delete?newUrl=https://api.github.com/repos/${username}/Themify_DB/contents/${res[i].path}&sha=${res[i].sha}&token=${props.access_token}`, {
            })
            await dele
                .json()
                .then((res: any) => {

                })
        }
        window.location.reload();
        Utilities.finishLoading();
    }

    return (
        <div className="card mb-3 " key={0}>
            <div className="card-img-top" style={{ height: "60px", backgroundColor: primary }} />
            <div className="card-body">
                <h5>
                    <a href="javacript:void(0)" onClick={props.onSelect}>
                        {props.name}
                    </a>
                </h5>
                <button onClick={() => deleteFile(props.username, props.name)} className="btn btn-outline-danger mr-1"><TrashFill /> Löschen</button>
            </div>
        </div>
    )
}
