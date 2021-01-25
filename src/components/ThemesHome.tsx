import React, { useState, useEffect } from "react";
import VariableGroup from "./VariableGroup";
import ThemeName from "./ThemeName";
import TextFieldWithTimer from "./TextFieldWithTimer";
import Examples from "./Examples";
import { getPhrase as _ } from "../shared";
import { Search, Utilities } from "blue-react";



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
    const [activeTab, setActiveTab] = useState<number>(0);
    const [error, setError] = useState<any>();
    const [resultStyle, setResultStyle] = useState<any>();
    const [searchValue, setSearchValue] = useState<any>();
    const [iscompiled, setIsCompiled] = useState<boolean>(false);
    const [cahngeVar, setChangeVar] = useState<boolean>(false);


    const [testStyle, settestStyle] = useState<string>("");


    const [CSS, setCSS] = useState<any>();

    useEffect(() => {
        if (!CSS) {
            jsVarToSass();
        }
    })

    useEffect(() => {
        if (Variables.length === 0) {
            const tempbtVariable = JSON.parse(JSON.stringify(varibales));
            Object.keys(tempbtVariable).map((item: any) => {
                tempbtVariable[item] = {}
            })

            setVarType();
            setVariables(varibales);
            setbtVariables(tempbtVariable);
            afterValueChange();
        }

    }, [Variables])

    useEffect(() => {
        if (Object.keys(props.value).length > 0) {
            setbtHashVars(props.value);
        }
    }, [props.value])

    useEffect(() => {
        setThemeName(props.name);
    }, [props.name])


    useEffect(() => {
        if (customStyle) {
            setCustomStyle(customStyle);
            // afterValueChange(false);
        } else {
            //afterValueChange(false);
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
        await setHash();
        await jsVarToSass();

    }

    const setHash = async () => {
        let tempbtVar: any = {};

        Object.keys(btVariables).map((i: any) => {
            const section = btVariables[i];
            if (Object.keys(section).length > 0) {
                tempbtVar[i] = section;
            }
        })

        const hashObject: any = {
            name: themeName,
            btHashVars
        }

        if (activeTab != 0) {
            hashObject.activeTab = activeTab;
        }

        if (customStyle != "") {
            hashObject.customStyle = customStyle;
        }

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
        return `//Open the following link to edit this config on Themify\n//${window.location.href}\n\n`;
    }

    const jsVarToSass = async () => {

        let bluevar = "// Blue variables\n//\n\n";
        let output: string = "";

        Object.keys(props.value).map((i: any) => {
            bluevar += i + ": " + props.value[i] + ";\n";
        })

        output = localStorage.getItem("css") + getComment() + bluevar;

        let version = localStorage.getItem("version")

        getCSS(version, output);
    }

    const getCSS = (version: any, css: any, callback?: (e?: any) => void) => {
        if (css) {
            fetch((window as any).themify_service + "scssToCss?version=" + version + "&scss=" + encodeURIComponent(css), {
                method: "GET",
                headers: { "Content-Type": "application/json" },

            })
                .then(res => {
                    return res.json();
                })
                .then(response => {
                    // Utilities.startLoading();
                    localStorage.setItem("css", JSON.stringify(response));
                    setCSS(response);
                    if (callback) {
                        callback();
                    }
                })
        }
    }

    return (
        <div className="row">
            <style>
                {CSS?.cssOutput}
            </style>
            <style>
                {testStyle}
            </style>
            <div className="col-md-5">
                <ThemeName
                    name={themeName}
                    onChange={(value: string) => { props.onChange("name", value) }}
                />

                <Search className="mt-1 mb-1"
                    value={searchValue}
                    onChange={(e: any) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                />

                {Object.keys(Variables).map((item: any) =>
                    <VariableGroup
                        key={item}
                        GroupName={item}
                        items={Variables[item]}
                        hashVar={btHashVars}
                        onChange={async (value: any, key: any) => {
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
                        search={searchValue}
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
