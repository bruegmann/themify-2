import React, { useEffect, useState } from 'react'
import { Plus } from "react-bootstrap-icons";
import ConfigAttribute from './ConfigAttribute';

export default function ConfigHome() {
    const [attribute, setAttribute] = useState<any>([]);
    const [values, setValues] = useState<any>();
    const [attributeTemplate, setAttributeTemplate] = useState<Object>({});
    const [change, setChange] = useState<boolean>(false);

    useEffect(() => {
        if (Object.keys(attribute).length === 0) {
            SetUp();
        }
    }, [attribute])

    const SetUp = () => {
        getAttributeTemplate(() => {
            setStartValue();
        })
    }

    const getAttributeTemplate = (callback: any) => {
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
                "description": ""
            }
            add.push(temp);
        }
        var _declaration = {
            "_attributes": {
                "version": "1.0",
                "encoding": "utf-8"
            }
        }
        appSettings = { add }
        item = { appSettings, _declaration }
        setValues(item);
        console.log(item)
    }


    const AddAttribute = () => {
        var temp = {
            "name": "Attribute",
            "type": "",
            "description": "",
            "default": "",
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
