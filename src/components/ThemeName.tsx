import React, { useState, useEffect } from 'react'
import { X, Check } from "react-bootstrap-icons"

export default function ThemeName(props: any) {

    const [edit, setEdit] = useState<Boolean>(false);
    const [name, setName] = useState<string>("");


    useEffect(() => {
        if (props.name) {
            setName(props.name)
        }
    }, [props.name])

    const Submit = () =>{
        setEdit(false);
        props.onChange(name);
    }

    const Cancel = () =>{
        setEdit(false);
        setName(props.name);
    }

    const PressKey = (key: number) =>{
        if(key === 13){
            Submit();
        }
    }

    return (
        <div className="mb-3 mt-3">
            {edit === true ?
                <div className="input-group input-group-lg">
                    <input
                        className="form-control"
                        value={name}
                        onChange={(event) => { setName(event.target.value) }}
                        onKeyDown={(event) => PressKey(event.keyCode )}
                    />

                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => Submit()}
                        >
                            <span><Check /></span>
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => Cancel()}
                        >
                            <span><X /></span>
                        </button>

                    </div>
                </div>
                :
                <h1
                    title="Rename Theme"
                    onClick={() => setEdit(true)}
                >
                    {name}
                </h1>
            }
        </div>
    )
}
