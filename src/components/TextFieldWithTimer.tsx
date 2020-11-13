import React, { useEffect, useState } from 'react'
import MonacoEditor from "react-monaco-editor";

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

let timer: any;



const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    formatOnType: true
};

export default function TextFieldWithTimer(props: any) {
    const [value, setValue] = useState<string>("")

    useEffect(() => {
        timer = null;
        if (props.value) {
            setValue(props.value);
        } else {
            setValue("/* " + props.placeholder + " */");
        }
    }, [props.value])


    useEffect(() => {
        if (!value && !props.value) {
            setValue("/* " + props.placeholder + " */");
        }
    }, [value])

    const handleChange = (v: any) => {
        let newValue: any;
        clearTimeout(timer)
        if (v.includes("/* " + props.placeholder + " */")) {
            newValue = v.replace(("/* " + props.placeholder + " */"), "");
        } else {
            newValue = v;
        }


        setValue(newValue);
        timer = setTimeout(() => { triggerChange() }, WAIT_INTERVAL);

    }

    const handleKeyDown = (e: any) => {
        if (e.keyCode === ENTER_KEY) {
            triggerChange();
        }
    }

    const triggerChange = () => {
        const v: any = value;

        props.onChange(v);
    }

    const autoLayout = (editor: any) => {
        window.addEventListener("resize", () => {
            editor.layout();
        })
    }
    const setInputEl = () => {
        let PROPS: any = {};
        Object.keys(props).map((propName: any) => {
            if (propName != "inputGroupPrepend" && propName != "type") {
                PROPS[propName] = props[propName]
            }
        })

        let inputEl: any;

        if (props.type === "text") {
            inputEl = (
                <input
                    {...props}
                    type="text"
                    value={value}
                    onChange={(event: any) => { handleChange(event.target.value) }}
                    onKeyDown={(event: any) => handleKeyDown(event)}
                />
            )
        } else if (props.type === "textarea") {
            inputEl = (
                <MonacoEditor
                    {...props}
                    height="600"
                    language="scss"
                    theme="vs-light"
                    value={value}
                    options={options}
                    onChange={(event: any) => handleChange(event)}
                    onKeyDown={(event: any) => handleKeyDown(event)}
                />
            )
        }

        if (props.inputGroupPrepend) {
            return (
                <div className="input-group">
                    <div className="input-group-prepend">
                        {props.inputGroupPrepend}
                    </div>
                    {inputEl}
                </div>
            )
        } else {
            return inputEl;
        }
    }
    return setInputEl();

}
