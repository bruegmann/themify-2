import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { TrashFill } from "react-bootstrap-icons"
import { getPhrase as _ } from '../shared';

export default function ThemeItem(props: any) {

    const [primary, setPrimary] = useState<string>("#ddd")

    return (
        <div className="card mb-3 " key={0}>
            <div className="card-img-top" style={{ height: "60px", backgroundColor: primary }} />
            <div className="card-body">
                <h5>
                    <a href="javacript:void(0)" onClick={props.onSelect}>
                        {props.name}
                    </a>
                </h5>
                <button className="btn btn-outline-danger mr-1"><TrashFill /> {_("DELETE")}</button>
            </div>
        </div>
    )
}
