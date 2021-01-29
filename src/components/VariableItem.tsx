import React, { useEffect, useState } from 'react'
import { InfoCircle, DropletHalf, CodeSlash } from "react-bootstrap-icons"
import { SketchPicker } from "react-color";

export default function VariableItem(props: any) {
    const [value, setValue] = useState<string>("");
    const [showColorPicker, setColorPicker] = useState<boolean>(false);

    const setDefaultValue = async () => {
        if (value === "" || value === undefined) {
            const tValue = await (props.items.value).replace(" !default", "")
            setStateValue(tValue);
        }
    }

    const setStateValue = (sValue: string) => {
        setValue(sValue);
        props.onChange(sValue);
    }

    const getBool = (value: string) => {
        if (value === "true") {
            return true
        }
        else {
            return false
        }
    }

    useEffect(() => {
        if (props.value !== undefined) {
            if (Object.keys(props.value).length > 0) {
                setValue(props.value[props.name])
            }
        }
    }, [props.value])

    const getInputFeld = () => {
        if (props.items.type === "boolean") {
            return (
                <div className="input-group mb-3 ">

                    <input
                        className="form-control default"
                        value={value}
                        onChange={(event) => { setStateValue(event.target.value) }}
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"></input>
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <input
                                type="checkbox" aria-label="Checkbox for following text input"
                                checked={getBool(value)}
                                onChange={(event) => { setStateValue(event.target.checked.toString()) }}
                            />
                        </div>
                    </div>
                </div>

            )
        }
        else if (props.items.type === "color") {
            return (
                <div>
                    <div className="input-group">
                        <input
                            className="form-control default"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            value={value}
                            onChange={(event) => { setStateValue(event.target.value) }}
                            placeholder={`/* ${props.items.value} */`}
                            onDoubleClick={() => { setDefaultValue() }}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setColorPicker(!showColorPicker)}

                            >
                                <span ><DropletHalf /></span>
                            </button>
                        </div>
                    </div>
                    <div className="offset-sm-1 col-sm-8">
                        {
                            showColorPicker === true &&
                            <SketchPicker
                                color={value}
                                onChangeComplete={(color: any) => setStateValue(color.hex)}
                            />
                        }
                    </div>
                </div>
            )
        }
        else {
            return (
                <input
                    className="form-control default"
                    placeholder={`/* ${props.items.value} */`}
                    value={value}
                    onChange={(event) => { setStateValue(event.target.value) }}
                    onDoubleClick={() => { setDefaultValue() }}
                />
            )
        }
    }

    return (
        <div className="row mb-2">
            <div className="col-5">
                <span title={props.items.description}>
                    <InfoCircle className="text-info mr-1" />
                </span>
                {props.name}
            </div>
            <div className="col">
                {getInputFeld()}
            </div>
        </div>
    )
}
