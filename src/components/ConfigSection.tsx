import React, { useEffect, useState } from 'react'
import { Plus } from "react-bootstrap-icons";
import { getPhrase as _ } from '../shared';

import ConfigAttribute from './ConfigAttribute';


export default function ConfigSection(props: any) {

    const [attribute, setAttribute] = useState<any>([]);
    const [change, setChange] = useState<boolean>(false);


    useEffect(() => {

        setAttribute(props.attribute);
    }, [props.attribute])

    const onChangeValue = (attrb: string, value: string, i: number) => {
        if (attrb === "delete") {
            attribute.splice(i, 1);
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

        console.log(attribute)

        props.onChange(JSON.stringify(attribute));
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
        setChange(!change);
        props.onChange(JSON.stringify(attribute));
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
