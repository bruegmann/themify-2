import React, { useEffect, useState } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown } from 'reactstrap';
import ConfigSection from './ConfigSection';
import { getPhrase as _ } from '../shared';

export default function ConfigHome(props: any) {
    const [attribute, setAttribute] = useState<any>({});
    const [selected, setSelected] = useState<string>("none");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [values, setValues] = useState<any>();
    const [change, setChange] = useState<boolean>(false);

    useEffect(() => {
        if (Object.keys(attribute).length === 0) {
            SetUp();
        }
    }, [attribute, props])

    useEffect(() => {
        var ls = String(localStorage.getItem("template"));

        if (ls !== "null" && props.user !== undefined) {
            setSelected(ls);
        }
        else {
            setSelected("none");
        }

    }, [props])


    const toggle = () => setDropdownOpen(!dropdownOpen);

    const SetUp = () => {
        let attr: any;
        if (props.defaultTemplate) {
            attr = JSON.parse(props.defaultTemplate.content);
            attribute[props.defaultTemplate.org] = attr;
            //setChange(!change); 
            setAttribute({ "none": [], "Brügmann": attr });
            setStartValue();
        }
    }

    const setStartValue = () => {
        var item = {};
        var add = [];
        var appSettings = {};

        for (var i = 0; i < Object.keys(attribute).length; i++) {
            var temp = {
                "name": Object.keys(attribute)[i],
                "value": "",
                "description": "",
            }
            add.push(temp);
        }
        var _declaration = {
            "_attributes": {
                "version": "1.0",
                "encoding": "utf-8"
            }
        }
        appSettings = { add };
        item = { appSettings, _declaration };
        setValues(item);
    }

    const setTemplate = (name: string) => {
        setSelected(name);

        if (name !== "none") {
            localStorage.setItem("template", name);
        }
        else {
            localStorage.removeItem("template");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center">
                <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggle} >
                    <DropdownToggle caret color="outline-primary">
                        {_("TEMPLATE")}: {selected}
                    </DropdownToggle>
                    <DropdownMenu>
                        {
                            Object.keys(attribute).map((item: any) =>
                                <DropdownItem onClick={() => setTemplate(item)}>{item}</DropdownItem>
                            )
                        }
                    </DropdownMenu>
                </InputGroupButtonDropdown >
            </div>
            {
                Object.keys(attribute).map((item: any, i: number) =>
                    <ConfigSection
                        keys={i}
                        attribute={attribute[item]}
                        name={item}
                        selected={selected}
                    />
                )
            }
        </div>
    )
}
