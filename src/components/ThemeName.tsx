import React, { useState, useEffect } from "react"
import { X, Check, Pen } from "react-bootstrap-icons"
import { getPhrase } from "../shared"

export default function ThemeName(props: any) {

    const [edit, setEdit] = useState<Boolean>(false);
    const [name, setName] = useState<string>("");


    useEffect(() => {
        if (props.name) {
            setName(props.name)
        }
    }, [props.name])

    const Submit = () => {
        setEdit(false);
        props.onChange(name);
    }

    const Cancel = () => {
        setEdit(false);
        setName(props.name);
    }

    const PressKey = (key: number) => {
        if (key === 13) {
            Submit();
        }
    }

    return (
        <div className={`mb-${edit ? "4" : "3"} mt-3`}>
            {edit === true ?
                <div className="input-group input-group-lg">
                    <input
                        className="form-control"
                        value={name}
                        onChange={(event) => { setName(event.target.value) }}
                        onKeyDown={(event) => PressKey(event.keyCode)}
                        autoFocus
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
                <div
                    className="d-flex align-items-center"
                >
                    <h1>{name}</h1>

                    <button
                        className="btn btn-link"
                        onClick={() => setEdit(true)}
                        title={getPhrase("RENAME_THEME")}
                    >
                        <Pen />
                    </button>
                </div>
            }
        </div>
    )
}
