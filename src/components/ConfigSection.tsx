import React, { useEffect, useState } from 'react'
import { Plus } from "react-bootstrap-icons";
import { getPhrase as _ } from '../shared';

import ConfigAttribute from './ConfigAttribute';


export default function ConfigSection(props: any) {

    const [attribute, setAttribute] = useState<any>([]);
    const [test, setTest] = useState<any>([]);
    const [change, setChange] = useState<boolean>(false);


    useEffect(() => {
        setAttribute(props.attribute);
    }, [props.attribute])

    const onChangeValue = (attrb: string, value: string, i: number) => {
        if (attrb === "delete") {
            props.onChange(JSON.stringify(attribute),JSON.stringify({"attr":"delete", "index":i}));
        }
        else if (attrb === "value") {
            props.onChange(JSON.stringify(attribute),JSON.stringify({"attr":"value", "value":value, "index":i}));
        }
        else {
            props.onChange(JSON.stringify(attribute),JSON.stringify({"attr":"name", "attrb":attrb, "value":value,"index":i}));
        }


        
    }

    const AddAttribute = async () => {
        var temp = {
            "name": "Attribute",
            "type": "",
            "description": "",
            "default": "",
            "editable": true
        }
       props.onChange(JSON.stringify(temp),JSON.stringify({"attr":"add"}));
    }


    return (
        <div>
            {props.selected === props.name &&
                <div>
                    <div className="d-flex justify-content-center">
                        <div className="col-9">
                            <div className="card pl-3 pr-3 pt-4 mt-3">
                                {attribute.length > 0 ?
                                    attribute.map((item: any, i: number) =>
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
                                    :
                                    <p className="text-center">{_("NO_ATTRIBUTES")}</p>
                                }
                                <button className="btn btn-outline-primary mb-3 mt-3" onClick={() => AddAttribute()}><Plus /> {_("ADD")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
