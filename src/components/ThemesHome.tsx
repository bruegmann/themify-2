import React, { useState, useEffect } from "react";
import VariableGroup from "./VariableGroup";
import ThemeName from "./ThemeName";
import { BrightnessAltHigh } from "react-bootstrap-icons";



let varibales = require("../data/bootstrap.variables.json")
let btTypes = require("../data/bootstrap.types.json")



const { Sass } = require("../lib/sass")
Sass.setWorkerUrl("sass.worker.js")

const sass = new Sass()
sass.options({
    style: Sass.style.compressed
})


export default function ThemesHome() {

    const [Variables, setVariables] = useState<any[]>([]);
    const [btVariables, setbtVariables] = useState<any[]>([]);
    const [outputStyle, setOutputStyle] = useState<string>("");
    const [customStyle, setCustomStyle] = useState<string>("");
    const [btHashVars, setbtHashVars] = useState<any[]>([]);
    const [compileBusy, setCompileBusy] = useState<Boolean>(false);
    const [name, setName] = useState<String>("Theme Name");

    useEffect(() => {
        if (Variables.length === 0) {
            const tempbtVariable = JSON.parse(JSON.stringify(varibales));
            Object.keys(tempbtVariable).map((item: any) => {
                tempbtVariable[item] = {}
            })
            console.log(JSON.stringify(ThemeName))

            setVarType();
            setVariables(varibales);
            setbtVariables(tempbtVariable);
        }

    }, [Variables])

    const setVarType = () => {
        Object.keys(varibales).map((item: any) => {
            Object.keys(varibales[item]).map((subitem: any) => {
                if (btTypes.boolean.includes(subitem)) {
                    varibales[item][subitem].type = "boolean"
                }
                else if (btTypes.color.includes(subitem)) {
                    varibales[item][subitem].type = "color"
                }
                else {
                    varibales[item][subitem].type = "string"
                }
            })
        })
    }

    const afterValueChange = async () => {
        setHash();
        await jsVarToSass();
        compile();
    }

    const setHash = () => {
        let tempbtVar: any = {};

        Object.keys(btVariables).map((i: any) => {
            const section = btVariables[i];
            if (Object.keys(section).length > 0) {
                tempbtVar[i] = section;
            }
        })

        const hashObject = {
            name: name,
            btHashVars: btHashVars
        }

        //TODO: if activeTab >> HomePage.js
        //TODO: if customStyle >> HomePage.js

        if (window.parent) {
            const variablesChangeEvent = new CustomEvent("variablesChangeEvent", {
                detail: hashObject
            });
            window.parent.document.dispatchEvent(variablesChangeEvent);
        }

        window.location.hash = "/home/" + encodeURIComponent(JSON.stringify(hashObject));

    }

    const getComment = () => {
        return `/*\nOpen the following link to edit this config on Themify\n${window.location.href}\n*/\n`;
    }

    const jsVarToSass = async () => {
        setOutputStyle("");
        var tempOutputStyle: string = "";

        Object.keys(btVariables).map((i: any) => {
            const section = btVariables[i];

            if (Object.keys(section).length > 0) {
                console.log(section)
                tempOutputStyle += `// ${i}\n//\n\n`;

                Object.keys(section).map((key: any) => {
                    tempOutputStyle += key + ": " + section[key].value + ";\n";
                });

                tempOutputStyle += "\n\n";
            }
        })

        tempOutputStyle = customStyle + "\n\n" + tempOutputStyle;

        if (tempOutputStyle !== "") {
            tempOutputStyle = getComment() + tempOutputStyle
        }
        await setOutputStyle(tempOutputStyle)

    }

    const compile = () => {
        //          var style = outputStyle;

        // sass.compile(style, (result:any) => {
        //     console.log(result)
        //   })

    }


    return (
        <div>
            <div className="col-md-5">
                <ThemeName
                    name={name}
                    onChange={(value: string) => { setName(value) }}
                />

                {Object.keys(Variables).map((item: any) =>
                    <VariableGroup
                        key={item}
                        GroupName={item}
                        items={Variables[item]}
                        onChange={(value: any, key: any) => {
                            if (value == "") {
                                delete btVariables[item][key]
                                delete btHashVars[key]
                            }
                            else {
                                btVariables[item][key] = { "value": value }
                                btHashVars[key] = value;
                            }
                            afterValueChange();
                        }}
                    />
                )
                }
            </div>
        </div>
    )
}
