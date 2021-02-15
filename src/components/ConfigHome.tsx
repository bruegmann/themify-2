import { Utilities } from 'blue-react';
import React, { useEffect, useState } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown } from 'reactstrap';
import { getPhrase as _ } from '../shared';
import ConfigSection from './ConfigSection';


export default function ConfigHome(props: any) {
    const [attribute, setAttribute] = useState<any>({});
    const [selected, setSelected] = useState<string>("none");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [change, setChange] = useState<boolean>(false);

    const [template, SetTemplate] = useState<any>([]);

    const [orgs, setOrgs] = useState<any>([]);
    const [orgTemplate, setOrgTemplate] = useState<any>([]);
    const [userTemplate, setUserTemplate] = useState<any>([]);

    useEffect(() => {
        if (Object.keys(props.config).length === 0) {
            if (Object.keys(attribute).length === 0) {
                SetUp();
            }
        }
        else {
            if (JSON.stringify(attribute) !== JSON.stringify(props.config)) {
                setAttribute({ ...props.config });
            }
        }

    }, [props.config]);

    useEffect(() => {
        // getAttributeTemplate(() => {

        // })

        if (orgs.length == 0) {
            getOrganisations();
        }
        if (props.user) {
            getUserTemplate();
        }




    }, [props.user && props.access_token]);

    useEffect(() => {
        console.log(orgs)
        if (orgs.length > 0) {
            getOrgTemplates();
        }
    }, [orgs])

    const toggle = () => setDropdownOpen(!dropdownOpen);


    const SetUp = async () => {
        await setAttribute({ "none": [] });
        await template.push({ "name": "none" })
        getAttributeTemplate(() => {
        })
    }

    //const setStartValue = () => {
    // var item = {};
    // var add = [];
    // var appSettings = {};

    // for (var i = 0; i < Object.keys(valueConfig).length; i++) {
    //     var temp = {
    //         "name": Object.keys(valueConfig)[i],
    //         "value": "",
    //         "description": "",
    //     }
    //     add.push(temp);
    // }
    // var _declaration = {
    //     "_attributes": {
    //         "version": "1.0",
    //         "encoding": "utf-8"
    //     }
    // }
    // appSettings = { add };
    // item = { appSettings, _declaration };
    // setValues(item);
    // console.log(item)


    const getOrganisations = async () => {
        const res = await fetch(`${(window as any).proxy}${props.user.organizations_url}`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json"
            }
        });

        await res
            .json()
            .then(async org => {
                console.log(org)
                var tempOrg = [];
                for (var i = 0; i < org.length; i++) {
                    tempOrg.push(org[i].login)
                }
                setOrgs(tempOrg);

            })
    }

    const getOrgTemplates = async () => {
        for (var i = 0; i < orgs.length; i++) {
            const datatree = await fetch(`${(window as any).proxy}https://api.github.com/repos/${orgs[i]}/Themify_DB/git/trees/main`, {
                headers: {
                    Authorization: `token ${props.access_token}`,
                    method: "get",
                    "Content-Type": "application/json"
                }
            });

            await datatree
                .json()
                .then(async tree => {
                    for (var j = 0; j < tree.tree.length; j++) {
                        if (tree.tree[j].path === "config") {
                            const dataconfig = await fetch(`${(window as any).proxy}${tree.tree[j].url}`, {
                                headers: {
                                    Authorization: `token ${props.access_token}`,
                                    method: "get",
                                    "Content-Type": "application/json"
                                }
                            });

                            await dataconfig
                                .json()
                                .then(async configtree => {
                                    for (var x = 0; x < configtree.tree.length; x++) {
                                        if (configtree.tree[x].path === "template") {
                                            const datatemplate = await fetch(`${(window as any).proxy}${configtree.tree[x].url}`, {
                                                headers: {
                                                    Authorization: `token ${props.access_token}`,
                                                    method: "get",
                                                    "Content-Type": "application/json"
                                                }
                                            });

                                            await datatemplate
                                                .json()
                                                .then(async configtree => {
                                                    for (var t = 0; t < configtree.tree.length; t++) {
                                                        console.log(configtree.tree[t]);
                                                        orgTemplate.push({ "name": configtree.tree[t].path.replace(".json", ""), "url": configtree.tree[t].url, "user": orgs[i] });
                                                        template.push({ "name": configtree.tree[t].path.replace(".json", ""), "url": configtree.tree[t].url, "user": orgs[i] });
                                                        //  var attr = { [configtree.tree[t].path.replace(".json", "")]: [] }
                                                        //  attribute.push(attr);
                                                        //  console.log(attr);
                                                    }
                                                })
                                        }
                                    }
                                })
                        }
                    }
                })

        }
    }

    const getUserTemplate = async () => {
        const datatree = await fetch(`${(window as any).proxy}https://api.github.com/repos/${props.user.login}/Themify_DB/git/trees/main`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json"
            }
        });

        await datatree
            .json()
            .then(async tree => {
                for (var j = 0; j < tree.tree.length; j++) {
                    if (tree.tree[j].path === "config") {
                        const dataconfig = await fetch(`${(window as any).proxy}${tree.tree[j].url}`, {
                            headers: {
                                Authorization: `token ${props.access_token}`,
                                method: "get",
                                "Content-Type": "application/json"
                            }
                        });

                        await dataconfig
                            .json()
                            .then(async configtree => {
                                for (var x = 0; x < configtree.tree.length; x++) {
                                    if (configtree.tree[x].path === "template") {
                                        const datatemplate = await fetch(`${(window as any).proxy}${configtree.tree[x].url}`, {
                                            headers: {
                                                Authorization: `token ${props.access_token}`,
                                                method: "get",
                                                "Content-Type": "application/json"
                                            }
                                        });

                                        await datatemplate
                                            .json()
                                            .then(async configtree => {
                                                for (var t = 0; t < configtree.tree.length; t++) {
                                                    console.log("yeag")
                                                    userTemplate.push({ "name": configtree.tree[t].path.replace(".json", ""), "url": configtree.tree[t].url })
                                                    template.push({ "name": configtree.tree[t].path.replace(".json", ""), "url": configtree.tree[t].url, "user": props.user.login })
                                                    // setAttribute({ ...attribute, [configtree.tree[t].path.replace(".json", "")]: [] })
                                                }
                                            })
                                    }
                                }
                            })
                    }
                }
            })
    }

    const getAttributeTemplate = async (callback: any) => {
        if (props.user && props.access_token) {
            const res = await fetch(`${(window as any).proxy}${props.user.organizations_url}`, {
                headers: {
                    Authorization: `token ${props.access_token}`,
                    method: "get",
                    "Content-Type": "application/json"
                }
            });

            await res
                .json()
                .then(async org => {
                    console.log(org)
                    var tempOrg = [];
                    for (var i = 0; i < org.length; i++) {
                        var company = org[i].login;
                        var repo = await fetch(`${(window as any).proxy}https://api.github.com/repos/${org[i].login}/themify-library/git/trees/main`, {
                            headers: {
                                Authorization: `token ${props.access_token}`,
                                method: "get",
                                "Content-Type": "application/json"
                            }
                        })

                        await repo
                            .json()
                            .then(async files => {
                                await files.tree.findIndex(async (item: any) => {
                                    if (item.path === "themify-library-template.json") {
                                        var file = await fetch(`${(window as any).proxy}${item.url}`, {
                                            headers: {
                                                Authorization: `token ${props.access_token}`,
                                                method: "get",
                                                "Content-Type": "application/json"
                                            }
                                        })

                                        await file
                                            .json()
                                            .then((data) => {
                                                var attr = JSON.parse(atob(data.content));
                                                attribute[company] = attr;
                                                setChange(!change);
                                            }
                                            );
                                    }
                                })
                            })
                    }
                })
            props.onChange(JSON.stringify(attribute), "config")
        }

        if (callback) {
            callback();
        }
    }

    const setTemplate = async (name: string, url?: string) => {

        if (!attribute[name]) {
            console.log(url)
            var template = await fetch(`${(window as any).proxy}${url}`, {
                headers: {
                    Authorization: `token ${props.access_token}`,
                    method: "get",
                    "Content-Type": "application/json"
                }
            })

            await template
                .json()
                .then(res => {
                    console.log(atob(res.content))
                    attribute[name] = JSON.parse(atob(res.content))
                })
                .catch(() =>{
                    Utilities.setAlertMessage(_("ERROR_TEMPLATE_FORMAT"),"danger", true)
                })
        }

        setSelected(name);

        // if (name !== "none") {
        //     localStorage.setItem("template", name);
        // }
        // else {
        //     localStorage.removeItem("template");
        // }
    }


    return (
        <div>
            <button onClick={() => console.log(attribute)}>template</button>
            <div className="d-flex justify-content-center">
                <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggle} >
                    <DropdownToggle caret color="outline-primary">
                        {_("TEMPLATE")}: {selected}
                    </DropdownToggle>                     <DropdownMenu>
                        {
                            // Object.keys(attribute).map((item: any) =>
                            //     <DropdownItem onClick={() => setTemplate(item)}>{item}</DropdownItem>
                            // )

                            template.map((item: any) =>
                                <DropdownItem onClick={() => setTemplate(item.name, item?.url)}>{item.name}</DropdownItem>
                            )
                        }
                    </DropdownMenu>
                </InputGroupButtonDropdown >
            </div>
            {Object.keys(attribute).map((item: any, i: number) =>
                <ConfigSection
                    keys={i}
                    attribute={attribute[item]}
                    name={item}
                    selected={selected}
                    onChange={async (value: string, attr: string, type?: string) => {
                        let objAttr = JSON.parse(attr)
                        if (objAttr.attr === "add") {
                            await attribute[selected].push(JSON.parse(value));
                        }
                        else if (objAttr.attr === "delete") {
                            await attribute[selected].splice(objAttr.index, 1);
                        }
                        else if (objAttr.attr === "value") {
                            if (objAttr.value !== "") {
                                attribute[selected][objAttr.index].value = objAttr.value;
                            }
                            else {
                                delete attribute[selected][objAttr.index].value;
                            }
                        }
                        else if (objAttr.attr === "name") {
                            attribute[selected][objAttr.index][objAttr.attrb] = objAttr.value;
                        }
                        props.onChange(JSON.stringify(attribute), "config");
                    }}
                />
            )
            }
        </div>
    )
}
