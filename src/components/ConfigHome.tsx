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

    const [valueConfig, setValueConfig] = useState<any>({});

    // useEffect(() => {
    //     if (Object.keys(attribute).length === 0) {
    //         SetUp();
    //     }
    // }, [attribute])

    useEffect(() => {
        if (Object.keys(valueConfig).length === 0) {
            SetUp();
        }
    }, [valueConfig])
    

    useEffect(() => {
        getAttributeTemplate(() => {

        })
    }, [props.user && props.access_token]);

    useEffect(() => {
        valueConfig[selected] = props.value
        setChange(!change);

        console.log(props.value, selected, attribute)
    }, [props.value])

    useEffect(()=>{
        console.log(valueConfig)
        setValueConfig(props.config)
    },[props.config])


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

    // const SetUp = async () => {
    //     await setAttribute({ "none": [] });
    //     getAttributeTemplate(() => {
    //         setStartValue();
    //     })
    // }

    const SetUp = async () => {
        await setValueConfig({ "none": [] });
        getAttributeTemplate(() => {
            setStartValue();
        })
    }

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
                                                valueConfig[company] = attr;
                                                setChange(!change);
                                            }
                                            );
                                    }
                                })
                            })
                    }
                })

                props.onChange(JSON.stringify(valueConfig), "config")
        }

        if (callback) {
            callback();
        }
    }

    const setStartValue = () => {
        var item = {};
        var add = [];
        var appSettings = {};

        for (var i = 0; i < Object.keys(valueConfig).length; i++) {
            var temp = {
                "name": Object.keys(valueConfig)[i],
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
                            Object.keys(valueConfig).map((item: any) =>
                                <DropdownItem onClick={() => setTemplate(item)}>{item}</DropdownItem>
                            )
                        }
                    </DropdownMenu>
                </InputGroupButtonDropdown >
            </div>
            {
                Object.keys(valueConfig).map((item: any, i: number) =>
                    <ConfigSection
                        keys={i}
                        attribute={valueConfig[item]}
                        name={item}
                        selected={selected}
                        onChange={(attr: string, type?: string) => {
                            valueConfig[selected].push(JSON.parse(attr))
                            props.onChange(attr, valueConfig)
                            props.onChange(attr)
                        }}
                    />
                )
            }
        </div>
    )
}
