import React, { useState, useEffect } from "react";
import VariableGroup from "./VariableGroup";
import ThemeName from "./ThemeName";
import { Utilities } from "blue-react";



let varibales = require("../data/bootstrap.variables.json")
let btTypes = require("../data/bootstrap.types.json")



const { Sass } = require("../lib/sass")
Sass.setWorkerUrl("sass.worker.js")

const sass = new Sass()
sass.options({
    style: Sass.style.compressed
})


export default function ThemesHome(props: any) {

    const [Variables, setVariables] = useState<any[]>([]);
    const [btVariables, setbtVariables] = useState<any[]>([]);
    const [outputStyle, setOutputStyle] = useState<string>("");
    const [customStyle, setCustomStyle] = useState<string>("");
    const [btHashVars, setbtHashVars] = useState<any>({});
    const [compileBusy, setCompileBusy] = useState<Boolean>(false);
    const [themeName, setThemeName] = useState<String>("");

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

    useEffect(() => {
        setOutputStyle(props.value);
    }, [props.value])

    useEffect(() => {
        console.log("js")
        compile();
    }, [outputStyle])

    useEffect(() => {
        setThemeName(props.name);
    }, [props.name])

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
        await setHash();
        await jsVarToSass();
       // await compile();
    }

    const setHash = async () => {
        let tempbtVar: any = {};

        Object.keys(btVariables).map((i: any) => {
            const section = btVariables[i];
            if (Object.keys(section).length > 0) {
                tempbtVar[i] = section;
            }
        })
        const hashObject = {
            name: themeName,
            btHashVars
        }
        console.log(btHashVars)

        //TODO: if activeTab >> HomePage.js
        //TODO: if customStyle >> HomePage.js

        // if (window.parent) {
        //     const variablesChangeEvent = new CustomEvent("variablesChangeEvent", {
        //         detail: hashObject
        //     });
        //     window.parent.document.dispatchEvent(variablesChangeEvent);
        // }
       // props.onChange("hash",  "/home/" + encodeURIComponent(JSON.stringify(hashObject)));
        props.onChange("value", btHashVars);
        //window.location.hash = "/home/" + encodeURIComponent(JSON.stringify(hashObject));

    }

    const getComment = () => {
        return `//\nOpen the following link to edit this config on Themify\n//${window.location.href}\n\n`;
    }

    const jsVarToSass = async () => {
        props.onChange("value", "")
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

        console.log(tempOutputStyle)
        tempOutputStyle = customStyle + "\n\n" + tempOutputStyle;

        if (tempOutputStyle !== "") {
            tempOutputStyle = getComment() + tempOutputStyle
        }

        //props.onChange("value", tempOutputStyle.toString())

    }

    const getCSS = (version: any, css: any, callback?: (e?: any) => void) => {

        fetch((window as any).themify_proxy + "scss_to_css?version=" + version + "&css=" + css, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(response => {
                Utilities.startLoading();
                localStorage.setItem("css", JSON.stringify(response));
                
                callback!(
                    window.location.reload()
                )
            })
    }

    const compile = () => {
       // var style = await outputStyle.toString()
       console.log("f")
        let version = localStorage.getItem("version")
        getCSS(version, outputStyle);
    }


    return (
        <div>
            <div className="col-md-5">
                <ThemeName
                    name={themeName}
                    onChange={(value: string) => { props.onChange("name", value) }}
                />

                {Object.keys(Variables).map((item: any) =>
                    <VariableGroup
                        key={item}
                        GroupName={item}
                        items={Variables[item]}
                        onChange={async (value: any, key: any) => {
                            console.log(value)
                            if (await value == "") {
                                delete btVariables[item][key]
                                delete btHashVars[key]
                            }
                            else {
                                btVariables[item][key] = { "value": value }
                                btHashVars[key] = value;
                            }
                            await afterValueChange();
                        }}
                    />
                )
                }
            </div>
        </div>
    )
}
