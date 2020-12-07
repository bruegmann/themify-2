import React, { useEffect, useState } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown } from 'reactstrap';
import { getPhrase as _ } from '../shared';
import ConfigSection from './ConfigSection';


export default function ConfigHome(props: any) {
    const [attribute, setAttribute] = useState<any>({});
    const [selected, setSelected] = useState<string>("none");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [change, setChange] = useState<boolean>(false);

    useEffect(() => {
        if (Object.keys(props.config).length === 0) {
            if (Object.keys(attribute).length === 0) {
                SetUp();
            }
        }
        else {
            if (JSON.stringify(attribute) !== JSON.stringify(props.config)) {
                setAttribute({ ...props.config });
            }
        }

    }, [props.config]);

    useEffect(() => {
        getAttributeTemplate(() => {

        })
    }, [props.user && props.access_token]);

    const toggle = () => setDropdownOpen(!dropdownOpen);


    const SetUp = async () => {
        await setAttribute({ "none": [] });
        getAttributeTemplate(() => {
        })
    }

    //const setStartValue = () => {
    // var item = {};
    // var add = [];
    // var appSettings = {};

    // for (var i = 0; i < Object.keys(valueConfig).length; i++) {
    //     var temp = {
    //         "name": Object.keys(valueConfig)[i],
    //         "value": "",
    //         "description": "",
    //     }
    //     add.push(temp);
    // }
    // var _declaration = {
    //     "_attributes": {
    //         "version": "1.0",
    //         "encoding": "utf-8"
    //     }
    // }
    // appSettings = { add };
    // item = { appSettings, _declaration };
    // setValues(item);
    // console.log(item)

    const getAttributeTemplate = async (callback: any) => {
        if (props.user && props.access_token) {
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
                    for (var i = 0; i < org.length; i++) {
                        var company = org[i].login;
                        var repo = await fetch(`${(window as any).proxy}https://api.github.com/repos/${org[i].login}/themify-library/git/trees/main`, {
                            headers: {
                                Authorization: `token ${props.access_token}`,
                                method: "get",
                                "Content-Type": "application/json"
                            }
                        })

                        await repo
                            .json()
                            .then(async files => {
                                await files.tree.findIndex(async (item: any) => {
                                    if (item.path === "themify-library-template.json") {
                                        var file = await fetch(`${(window as any).proxy}${item.url}`, {
                                            headers: {
                                                Authorization: `token ${props.access_token}`,
                                                method: "get",
                                                "Content-Type": "application/json"
                                            }
                                        })

                                        await file
                                            .json()
                                            .then((data) => {
                                                var attr = JSON.parse(atob(data.content));
                                                attribute[company] = attr;
                                                setChange(!change);
                                            }
                                            );
                                    }
                                })
                            })
                    }
                })
            props.onChange(JSON.stringify(attribute), "config")
        }

        if (callback) {
            callback();
        }
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
                    </DropdownToggle>                     <DropdownMenu>
                        {
                            Object.keys(attribute).map((item: any) =>
                                <DropdownItem onClick={() => setTemplate(item)}>{item}</DropdownItem>
                            )
                        }
                    </DropdownMenu>
                </InputGroupButtonDropdown >
            </div>
            {Object.keys(attribute).map((item: any, i: number) =>
                <ConfigSection
                    keys={i}
                    attribute={attribute[item]}
                    name={item}
                    selected={selected}
                    onChange={async (value: string, attr: string, type?: string) => {
                        let objAttr = JSON.parse(attr)
                        if (objAttr.attr === "add") {
                            await attribute[selected].push(JSON.parse(value));
                        }
                        else if (objAttr.attr === "delete") {
                            await attribute[selected].splice(objAttr.index, 1);
                        }
                        else if (objAttr.attr === "value") {
                            if (objAttr.value !== "") {
                                attribute[selected][objAttr.index].value = objAttr.value;
                            }
                            else {
                                delete attribute[selected][objAttr.index].value;
                            }
                        }
                        else if (objAttr.attr === "name") {
                            attribute[selected][objAttr.index][objAttr.attrb] = objAttr.value;
                        }
                        props.onChange(JSON.stringify(attribute), "config");
                    }}
                />
            )
            }
        </div>
    )
}
