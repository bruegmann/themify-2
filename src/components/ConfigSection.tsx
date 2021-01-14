import React, { useEffect, useState } from 'react'
import { Plus } from "react-bootstrap-icons";
import { getPhrase as _ } from '../shared';

import ConfigAttribute from './ConfigAttribute';
import { Utilities } from "blue-react";


export default function ConfigSection(props: any) {

    const [attribute, setAttribute] = useState<any>([]);
    const [test, setTest] = useState<any>([]);
    const [change, setChange] = useState<boolean>(false);

    const [BlueReactVersionen, setBlueReactVersionen] = useState<any>();
    const [CSS, setCSS] = useState<any>();

    useEffect(() => {
        setAttribute(props.attribute);
    }, [props.attribute])

    useEffect(() => {
        if (!BlueReactVersionen) {
            getVersions();
        }
    }, [BlueReactVersionen])

    const onChangeValue = (attrb: string, value: string, i: number) => {
        if (attrb === "delete") {
            props.onChange(JSON.stringify(attribute), JSON.stringify({ "attr": "delete", "index": i }));
        }
        else if (attrb === "value") {
            props.onChange(JSON.stringify(attribute), JSON.stringify({ "attr": "value", "value": value, "index": i }));
        }
        else {
            props.onChange(JSON.stringify(attribute), JSON.stringify({ "attr": "name", "attrb": attrb, "value": value, "index": i }));
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
        props.onChange(JSON.stringify(temp), JSON.stringify({ "attr": "add" }));
    }

    const getVersions = () => {
        fetch((window as any).themify_service + "versions", {
        })
            .then(res => {
                return res.json();
            })
            .then(response => {
                let array = [] as any[];
                console.log("vvve");
                const json = response;
                Object.keys(json.time).forEach((key, index) => {
                    if (key !== "modified" && key !== "created" || key !== "created" && key !== "modified") {
                        array.push(key);
                    }
                })
                console.log(array);
                let currentNumber = undefined as any;
                let currentTempArr = [] as any;
                const sortedArray = array.reduce((tempArr: any, value: any) => {
                    // check if current number is set
                    if (currentNumber == undefined) currentNumber = value;

                    // if current number then push to temp array
                    const val = value.slice(2, 4);
                    if (currentNumber.includes(val, 2)) {
                        currentTempArr.push(value);
                    }
                    // else just create a new array and push the old one into the parent array
                    else {
                        tempArr.push(currentTempArr);
                        currentTempArr = [];
                        currentNumber = value;
                        currentTempArr.push(value);
                    }

                    // return the array back to the next reduce iteration
                    return tempArr;
                }, [])
                sortedArray.push(currentTempArr);

                let array2 = [] as any;
                sortedArray.map((value: any, index: any) => {
                    const v = value.slice(-1);
                    //selected={localStorage.getItem("version") === v[0] ? true : false}
                    array2.push(<option key={index} value={v[0]}>{v[0]}</option>);
                })

                array2.push(<option key="latest" value="latest">latest</option>)

                setBlueReactVersionen(array2);

            })
    }


    const getCSS = (version: any, css: any, callback?: (e?: any) => void) => {

        fetch((window as any).themify_service + "scssToCss?version=" + version + "&css=" + css, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(response => {
                Utilities.startLoading();
                localStorage.setItem("css", JSON.stringify(response));
                setCSS(response);
                callback!(
                    window.location.reload()
                )
            })
    }

    const installBlueReact = (e: any) => {
        localStorage.setItem("version", e.target.value);
        const changedCSS = "//"
        getCSS(e.target.value, changedCSS);
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

                            <div className="input-group mb-3 mt-3 w-25 mx-auto">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="inputGroupSelect01">Blue React Version</label>
                                </div>
                                <select value={localStorage.getItem("version")!} onChange={(e: any) => { installBlueReact(e) }} className="custom-select" id="inputGroupSelect01">
                                    {BlueReactVersionen?.map((item: any) => (
                                        item
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
