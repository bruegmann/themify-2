import React, { useEffect, useState } from 'react';
import { InfoCircle, Pencil, Trash, X, Check, DropletHalf, CaretDown } from "react-bootstrap-icons";
import { InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, CustomInput } from 'reactstrap';
import { SketchPicker } from "react-color";
import { getPhrase as _ } from '../shared';

export default function ConfigAttribute(props: any) {
    const [value, setValue] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [Edit, setEdit] = useState<boolean>(false);
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [changedType, setChangedType] = useState<boolean>(false);
    const [editable, setEditable] = useState<boolean>(false);


    useEffect(() => {
        setType(props.type);
    }, [props.type]);

    useEffect(() => {
        if (props.name) {
            setName(props.name);
        }
    }, [props.name]);

    useEffect(() => {
        if (props.value) {
            setValue(props.value);
        }
        else {
            setValue("");
        }
        CheckType(props.value);
    }, [props.value])

    useEffect(() => {
        if (type !== "color") {
            setShowColorPicker(false);
        }
    }, [type])

    useEffect(() => {
        if (props.editable === true) {
            setEditable(true)
        }
    }, [props.editable])


    const toggle = () => setDropdownOpen(!dropdownOpen);


    const CheckType = (checkValue: string) => {
        if (editable === true) {
            if (String(checkValue) === "true" || String(checkValue) === "false") {
                if (type !== "boolean") {
                    props.onChange("type", "boolean")
                }
            }
            else {
                if (changedType === false) {
                    props.onChange("type", "")
                }
            }

            if (checkValue) {
                if (checkValue.includes("#") || checkValue.includes("rgb")) {
                    props.onChange("type", "color")
                }
            }
        }
    }

    const getCheckboxChecked = (cbValue: string) => {
        if (cbValue === "false") {
            return false;
        }
        else {
            return true;
        }
    }

    const changeType = (value: string) => {
        if (editable === true) {
            if (value === String("file")) {
                setValue("");
                props.onChange("value", "")
            }
            else if (value === String("boolean")) {
                props.onChange("value", String(true))
            }
            else if (value === String("color")) {
                props.onChange("value", "#000000")
            }

            props.onChange("type", value);

            if (value !== "") {
                setChangedType(true);
            }
            else {

                setChangedType(false);
            }
        }
    }

    const submitName = () => {
        setEdit(false);
        props.onChange("name", name)
    }

    const onChangeName = (e: any) => {
        setName(e.target.value);
    }

    const onChangeCheckbox = (e: any) => {
        props.onChange("value", String(e.target.checked))
    }

    const onChangeValue = (e: any) => {
        props.onChange("value", e.target.value)
    }

    const onChangeFile = (e: any) => {
        props.onChange("value", e.target.files[0].name)
    }

    const deleteAttribute = () => {
        props.onChange("delete", "")
    }

    const onKey = (e: any) => {
        if (e.charCode === 13) {
            submitName();
        }
    }

    const isDisabled = () => {
        if (editable === true) {
            return false
        }
        else {
            return true
        }
    }


    return (
        <div>
            <div className="row">
                <div className="col-5 d-flex align-items-center">
                    <button className="btn btn-danger mr-1" title="Löschen" onClick={() => deleteAttribute()} disabled={isDisabled()}>
                        <Trash />
                    </button>
                    <button className="btn btn-primary mr-3" title="Name ändern" onClick={() => setEdit(true)} disabled={isDisabled()}>
                        <Pencil />
                    </button>
                    <span className="mr-1" title={props.description}>
                        <InfoCircle className="text-info mr-1" />
                    </span>
                    {Edit === false ?
                        <p className="mb-0">{name}</p>
                        :
                        <div className="input-group input-group-lg">
                            <input
                                className="form-control"
                                onChange={onChangeName}
                                value={name}
                                onKeyPress={onKey}
                            />

                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => submitName()}
                                >
                                    <span><Check /></span>
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => { setEdit(false); setName(props.name) }}
                                >
                                    <span><X /></span>
                                </button>

                            </div>
                        </div>
                    }
                </div>
                <div className="col">
                    <InputGroup>
                        {type === "file" ?
                            <div className="custom-file">
                                <CustomInput
                                    {...props}
                                    onDoubleClick={() => { setValue(props.default) }}
                                    onChange={onChangeFile}
                                    type="file"
                                    value={value}
                                />
                            </div>
                            :
                            <input
                                className="form-control default"
                                onChange={onChangeValue}
                                onDoubleClick={() => { setValue(props.default) }}
                                placeholder={`/* ${props.default} */`}
                                value={value}
                                aria-describedby="emailHelp"
                            />


                        }
                        {type === "boolean" &&
                            <div className="input-group-prepend">
                                <div className="input-group-text">
                                    <input
                                        type="checkbox"
                                        checked={getCheckboxChecked(value)}
                                        onChange={onChangeCheckbox}
                                    />
                                </div>
                            </div>
                        }
                        {type === "color" &&
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                >
                                    <span ><DropletHalf /></span>
                                </button>
                            </div>
                        }
                        {editable === true &&
                            <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggle} >
                                <DropdownToggle caret>
                                    Type
                            </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => changeType("")}>{_("TEXT")}</DropdownItem>
                                    <DropdownItem onClick={() => changeType("file")}>{_("FILE")}</DropdownItem>
                                    <DropdownItem onClick={() => changeType("color")}>{_("COLOR")}</DropdownItem>
                                    <DropdownItem onClick={() => changeType("boolean")}>{_("BOOLEAN")}</DropdownItem>
                                </DropdownMenu>
                            </InputGroupButtonDropdown >
                        }

                    </InputGroup>
                </div>

                <div className="offset-sm-1 col-sm-10 mb-2 d-flex justify-content-end">
                    {showColorPicker === true &&
                        <SketchPicker
                            color={value}
                            onChangeComplete={(color: any) => setValue(color.hex)}
                        />
                    }
                </div>
            </div>
        </div>

    )
}
