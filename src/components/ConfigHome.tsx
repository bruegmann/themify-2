import React, { useEffect, useState } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown } from 'reactstrap';
import ConfigSection from './ConfigSection';
import { getPhrase as _ } from '../shared';

export default function ConfigHome(props: any) {
    const [attribute, setAttribute] = useState<any>({});
    const [selected, setSelected] = useState<string>("none");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [values, setValues] = useState<any>();
    const [change, setChange] = useState<boolean>(false);


    const [orgs, setOrgs] = useState<any>();
    const [orgTemplate, setOrgTemplate] = useState<any>([]);



    useEffect(() => {
        if (!orgs && props.user) {
            getOrgs(props.user?.login);
        }
    })

    useEffect(() => {
        if (orgs) {
            getTemplateOrgs();
        }
    }, [orgs])




    useEffect(() => {
        if (Object.keys(attribute).length === 0) {
            SetUp();
        }
    }, [attribute, props])

    useEffect(() => {
        var ls = String(localStorage.getItem("template"));

        if (ls !== "null" && props.user !== undefined) {
            setSelected(ls);
        }
        else {
            setSelected("none");
        }

    }, [props])


    const toggle = () => setDropdownOpen(!dropdownOpen);

    const SetUp = () => {
        let attr: any;
        if (props.defaultTemplate) {
            attr = JSON.parse(props.defaultTemplate.content);
            attribute[props.defaultTemplate.org] = attr;
            //setChange(!change); 
            setAttribute({ "none": [], "Brügmann": attr });
            setStartValue();
        }
    }


    const getOrgs = async (username: any) => {

        const res = await fetch(`${(window as any).proxy}https://api.github.com/users/${username}/orgs`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json",
            }
        });

        var tempOrgs: any = [];
        await res
            .json()
            .then((res: any) => {
                for (let i = 0; i < res.length; i++) {
                    tempOrgs.push(res[i].login);
                }
            })
            .then(() => {
                setOrgs(tempOrgs);
            })
    }

    const getTemplateOrgs = () => {
        for (let i = 0; i < orgs.length; i++) {
            fetch(`${(window as any).themify_proxy}https://api.github.com/repos/${orgs[i]}/Themify_DB/git/trees/main`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `token ${props.access_token}`
                }
            })
                .then(res => res.json())
                .then((repo: any) => {
                    for (let t = 0; t < repo.tree.length; t++) {
                        if (repo.tree[t].path === "config") {
                            fetch(`${(window as any).themify_proxy}${repo.tree[t].url}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json",
                                    "Authorization": `token ${props.access_token}`
                                } 
                            })
                                .then(res => res.json())
                                .then((f_config: any) => {
                                    for (let x = 0; x < f_config.tree.length; x++) {
                                        if (f_config.tree[x].path === "template") {
                                            fetch(`${(window as any).themify_proxy}${f_config.tree[x].url}`, {
                                                method: "GET",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Accept": "application/json",
                                                    "Authorization": `token ${props.access_token}`
                                                }
                                            })
                                                .then(res => res.json())
                                                .then((f_template: any) => {
                                                    if (orgTemplate.length <= 0) {
                                                        for (let j = 0; j < f_template.tree.length; j++) {
                                                            orgTemplate.push({ "name": f_template.tree[j].path, "org": orgs[i], "url": f_template.tree[j].url, "template": [] })
                                                        }
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

    const getTemplateUser = () => {

    }


    const setStartValue = () => {
        var item = {};
        var add = [];
        var appSettings = {};

        for (var i = 0; i < Object.keys(attribute).length; i++) {
            var temp = {
                "name": Object.keys(attribute)[i],
                "value": "",
                "description": "",
            }
            add.push(temp);
        }
        var _declaration = {
            "_attributes": {
                "version": "1.0",
                "encoding": "utf-8"
            }
        }
        appSettings = { add };
        item = { appSettings, _declaration };
        setValues(item);
    }

    const setTemplate = (name: string) => {
        setSelected(name);

        if (name !== "none") {
            localStorage.setItem("template", name);
        }
        else {
            localStorage.removeItem("template");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center">
                <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggle} >
                    <DropdownToggle caret color="outline-primary">
                        {_("TEMPLATE")}: {selected}
                    </DropdownToggle>
                    <DropdownMenu>
                        {
                            Object.keys(attribute).map((item: any) =>
                                <DropdownItem onClick={() => setTemplate(item)}>{item}</DropdownItem>
                            )
                        }
                    </DropdownMenu>
                </InputGroupButtonDropdown >
            </div>
            {
                Object.keys(attribute).map((item: any, i: number) =>
                    <ConfigSection
                        keys={i}
                        attribute={attribute[item]}
                        name={item}
                        selected={selected}
                    />
                )
            }

            <button onClick={() => console.log(orgTemplate)}>click</button>
        </div>
    )
}
