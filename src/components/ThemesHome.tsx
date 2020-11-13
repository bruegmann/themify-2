import React, { useState, useEffect } from "react";
import VariableGroup from "./VariableGroup";
import ThemeName from "./ThemeName";
import TextFieldWithTimer from "./TextFieldWithTimer";
import Examples from "./Examples";
import { getPhrase as _ } from "../shared";
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
    const [btHashVars, setbtHashVars] = useState<any[]>([]);
    const [compileBusy, setCompileBusy] = useState<Boolean>(false);
    const [themeName, setThemeName] = useState<String>("");
    const [activeTab, setActiveTab] = useState<number>(0);
    const [error, setError] = useState<any>();
    const [resultStyle, setResultStyle] = useState<any>();

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
            afterValueChange();
        }

    }, [Variables])

    useEffect(() => {
        setThemeName(props.name);
    }, [props.name])

    useEffect(() => {
        if (customStyle) {
            setCustomStyle(customStyle);
            afterValueChange();
        } else {
            afterValueChange();
        }
    }, [customStyle])


    useEffect(() => {
        if (compileBusy) {
            Utilities.startLoading();
        } else {
            Utilities.finishLoading();
        }
    }, [compileBusy])

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

        const hashObject: any = {
            name: themeName,
            btHashVars: btHashVars
        }

        if (activeTab != 0) {
            hashObject.activeTab = activeTab;
        }

        if (customStyle != "") {
            hashObject.customStyle = customStyle;
        }

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

    const jsVarToSass = async (callback?: any) => {
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
        if (callback!) {
            callback();
        }

    }

    const compile = (callback?: any) => {
        // let style: string;
        // if (props.defaultCSS && !localStorage.getItem("css")) {
        //     style = outputStyle + JSON.parse(JSON.stringify(props.defaultCSS));
        // } else if (localStorage.getItem("css")) {
        //     style = outputStyle + JSON.parse(localStorage.getItem("css")!)
        // }

        // console.log(style!);
        // setCompileBusy(true);
        // sass.compile(style!, (result: any) => {
        //     setCompileBusy(false);
        //     console.log(result)
        //     if (result.status === 1) {
        //         setError(result)
        //     }

        //     if (result.text) {
        //         setResultStyle(result.text);
        //         //localStorage.setItem("css", JSON.stringify(result.text));
        //         setError(null);
        //         if (callback!) {
        //             callback();
        //         }
        //     }
        // })


    }



    return (
        <div className="row">
            <div className="col-md-5">
                <ThemeName
                    name={themeName}
                    onChange={(value: string) => { props.onChange(value) }}
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
            <div className="col-md-7">
                <div className="form-group">
                    <TextFieldWithTimer
                        type="textarea"
                        className="form-control default"
                        onChange={(value: any) => setCustomStyle(value)}
                        placeholder={_("CUSTOM_STYLE_PLACEHOLDER")}
                        spellCehck={false}
                    />
                    {
                        error?.message &&
                        <div className="container pl-0 pr-0 mt-1">
                            <div className=" alert alert-danger">
                                <button className="close" onClick={() => setError(null)}>&times;</button>

                                <h4>{_("SOMETHING_WENT_WRONG")} 🤔</h4>
                                <p style={{ whiteSpace: "pre-wrap" }}>
                                    {_("COMPILE_ERROR_TXT")}
                                </p>

                                <p>
                                    {_("THIS_IS_ERROR_MESSAGE")}
                                    <code>{error.message}</code>
                                </p>
                            </div>
                        </div>
                    }
                    <div className="mt-2 mb-2">
                        <textarea
                            className="form-control default"
                            value={outputStyle}
                            readOnly
                            disabled
                            placeholder={_("OUTPUT_STYLE_PLACEHOLDER")}
                            style={{ minHeight: "200px", wordWrap: "inherit" }}
                            spellCheck={false}
                        />
                    </div>
                </div>
                <Examples
                    activeTab={activeTab}
                    onClick={(i: any) => { setActiveTab(i); setHash() }}
                />
            </div>
        </div>
    )
}
