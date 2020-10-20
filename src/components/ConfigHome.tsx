import React, { useEffect, useState } from 'react'
import { Plus } from "react-bootstrap-icons";
import { isGetAccessor } from 'typescript';
import ConfigAttribute from './ConfigAttribute';

export default function ConfigHome(props: any) {
    const [attribute, setAttribute] = useState<any>([]);
    const [values, setValues] = useState<any>();
    const [attributeTemplate, setAttributeTemplate] = useState<Object>({});
    const [change, setChange] = useState<boolean>(false);
    const [user, setUser] = useState<any>();

    useEffect(() => {
        if (Object.keys(attribute).length === 0) {
            SetUp();
        }
    }, [attribute])

    useEffect(() => {
        getAttributeTemplate(() => {

        })
    }, [props.user && props.access_token])

    const SetUp = () => {
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
                .then(org => {
                    console.log(org)
                    for (var i = 0; i < org.length; i++) {
                        fetch(`${(window as any).proxy}https://api.github.com/repos/${org[i].login}/themify-library/git/trees/main`, {
                            headers: {
                                Authorization: `token ${props.access_token}`,
                                method: "get",
                                "Content-Type": "application/json"
                            }
                        })
                            .then(resRepo => resRepo.json())
                            .then(files => {
                                console.log(files);

                                files.tree.findIndex((item: any) => {
                                    if (item.path === "themify-library-template.json") {
                                        fetch(`${(window as any).proxy}${item.url}`, {
                                            headers: {
                                                Authorization: `token ${props.access_token}`,
                                                method: "get",
                                                "Content-Type": "application/json"
                                            }
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                var attr = JSON.parse(atob(data.content));
                                                setAttribute(attr);
                                            })
                                    }
                                })

                            });
                    }
                })
        }

        //getAttribute from GitHub (Template)
        if (callback) {
            callback();
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


    const AddAttribute = () => {
        var temp = {
            "name": "Attribute",
            "type": "",
            "description": "",
            "default": "",
            "editable": true
        }
        attribute.push(temp);
        setChange(!change)
    }


    const onChangeValue = (attrb: string, value: string, i: number) => {
        if (attrb === "delete") {
            delete attribute[i];
            setChange(!change)
        }
        else if (attrb === "value") {
            if (value !== "") {
                attribute[i].value = value;
            }
            else {
                delete attribute[i].value;
            }
            setChange(!change)
        }
        else {
            attribute[i][attrb] = value;
            setChange(!change)
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-outline-primary" onClick={() => AddAttribute()}><Plus /> Add</button>
            </div>
            <div className="d-flex justify-content-center">
                {attribute &&
                    <div className="col-9">
                        <div className="card pl-3 pr-3 pt-4 pb-2 mt-3">
                            {attribute.map((item: any, i: number) =>
                                <ConfigAttribute
                                    key={i}
                                    name={item.name}
                                    default={item.default}
                                    value={item.value}
                                    type={item.type}
                                    editable={item?.editable}
                                    onChange={(attrb: string, value: string) => { onChangeValue(attrb, value, i) }}
                                />
                            )
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
