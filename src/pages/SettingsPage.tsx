import React, { useEffect, useState } from "react";
import { Page, Header, HeaderTitle, Body, Actions, Utilities, Switch } from "blue-react";
import { appLogo, appTitle, getPhrase as _ } from "../shared";



function SettingsPage(props: any) {
    const [BlueReactVersionen, setBlueReactVersionen] = useState<any>();
    const [CSS, setCSS] = useState<any>();
    const [Checked, setChecked] = useState<any>();

    useEffect(() => {
        if (!BlueReactVersionen) {
            getVersions();
        }
    })

    const getVersions = () => {
        fetch((window as any).themify_proxy + "versionen", {
        })
            .then(res => {
                return res.json();
            })
            .then(response => {
                let array = [] as any[];


                const json = response;
                Object.keys(json.time).forEach((key, index) => {
                    if (key !== "modified" && key !== "created" || key !== "created" && key !== "modified") {
                        array.push(key);
                    }
                })

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



                setBlueReactVersionen(array2);

            })
    }


    const getCSS = (version: any, css?: any, callback?: (e?: any) => void) => {
        fetch((window as any).themify_proxy + "scss_to_css?version=" + version + "&css=" + css, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(response => {
                Utilities.startLoading();
                setCSS(response);
                localStorage.setItem("css", JSON.stringify(response));

                callback!(
                    window.location.reload()
                )
            })
    }

    const installBlueReact = (e: any) => {
        localStorage.setItem("version", e.target.value);
        getCSS(e.target.value);
        console.log(localStorage.getItem("version"));
    }

    const AutoLogin = () => {

        if (!localStorage.getItem("auto_login")) {
            localStorage.setItem("auto_login", "true")
            window.location.reload();
        } else {
            localStorage.removeItem("auto_login")
            window.location.reload();
        }
    }


    return (
        <Page hasActions={true} >
            <Header>
                <HeaderTitle logo={appLogo} appTitle={appTitle}>Settings</HeaderTitle>
            </Header>
            <Actions break="xl">

            </Actions>
            <Body className="pl-5 pr-5">
                <div id="settingsPage">
                    <div className="input-group mb-3 w-25 pt-2">
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
                <div>
                    <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="customSwitch1" onChange={() => AutoLogin()} checked={localStorage.getItem("auto_login") ? true : false} />
                        <label className="custom-control-label font-weight-normal" htmlFor="customSwitch1">{localStorage.getItem("auto_login") ? "Auto-Login Enabled" : "Auto-Login Disabled"}</label>
                    </div>
                </div>
            </Body>
        </Page >
    );
}

export default SettingsPage;