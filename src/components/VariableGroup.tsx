import React, { useState, useEffect } from 'react'
import VariableItem from './VariableItem'


export default function VariableGroup(props: any) {

    const [showGroupItem, setShowGroupItem] = useState<Boolean>(true);
    const [children, setChildren] = useState<any>();

    useEffect(() => {
        if (props.search !== "" && props.search !== null && props.search !== undefined) {
            let array: any[] = [];
            Object.keys(props.items).map((item: any) => {
                const val = item.replace("$", "");
                if (val.toLowerCase().includes(props.search.toLowerCase()) && val !== "") {
                    array.push(<VariableItem
                        key={item}
                        name={item}
                        items={props.items[item]}
                        onChange={(value: string) => {
                            props.onChange(value, item)

                        }} />);
                }
            })


            setChildren(array);
        } else {
            setChildren("");
        }
    }, [props])
    return (

        <div className={props.search !== "" && props.search !== undefined && props.search !== null && (Array.isArray(children) && children.length === 0 || children === undefined || children === null) ? "card mb-3 d-none" : "card mb-3"}>
            <div className="card-body">
                <a
                    href="javascript:void(0)"
                    target="_self"
                    onClick={() => { setShowGroupItem(!showGroupItem) }}
                >
                    <h5>
                        {props.GroupName}
                    </h5>
                </a>
                {props.search !== "" && props.search !== undefined && props.search !== null ?
                    children
                    :
                    showGroupItem === true && (props.search === undefined || props.search === "") &&
                    Object.keys(props.items).map((item: any) =>
                        <VariableItem
                            key={item}
                            value={props.hashVar}
                            name={item}
                            items={props.items[item]}
                            onChange={(value: string) => {
                                props.onChange(value, item)

                            }}
                        />

                    )
                }

            </div>
        </div>
    )
}
