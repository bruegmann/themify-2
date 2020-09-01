import React, { useState, useEffect } from "react";
import GroupObject from "./GroupObject";



let varibales = require("../data/bootstrap.variables.json")

export default function ThemesHome() {

    const [btVariables, setbtVariables] = useState<any[]>([]);

    useEffect(() => {
        if (btVariables.length == 0) {
            const tempbtVariable = JSON.parse(JSON.stringify(varibales));

            Object.keys(tempbtVariable).map((item: any) => {
                btVariables[item] = {}
            })

            setbtVariables(varibales);
        }


    }, [btVariables])



    return (
        <div>
            {Object.keys(btVariables).map((item: Object) =>
                <GroupObject
                    GroupName={item}
                    Item={btVariables}
                />
            )
            }
        </div>
    )
}
