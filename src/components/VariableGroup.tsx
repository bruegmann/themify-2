import React, { useState, useEffect } from 'react'
import VariableItem from './VariableItem'


export default function VariableGroup(props: any) {

    const [showGroupItem, setShowGroupItem] = useState<Boolean>(true);


    return (
        <div className="card mb-3">
           
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

                {showGroupItem === true &&
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
