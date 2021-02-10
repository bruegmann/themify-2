import React, { useEffect, useState } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown } from 'reactstrap';
import { getPhrase as _ } from '../shared';
import ConfigSection from './ConfigSection';


export default function ConfigHome(props: any) {
    const [attribute, setAttribute] = useState<any>({});
    const [selected, setSelected] = useState<string>("none");
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [change, setChange] = useState<boolean>(false);


    const [orgs, setOrgs] = useState<any>();
    const [orgTemplate, setOrgTemplate] = useState<any>([]);
    const [userTemplate, setUserTemplate] = useState<any>([]);



    useEffect(() => {
        if (!orgs && props.user) {
            getOrgs(props.user?.login);
        }

        if (props.user && props.access_token) {
            getTemplateUser();
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
        console.log(props.defaultTemplate)
        if (props.defaultTemplate) {
            attr = JSON.parse(props.defaultTemplate.content);
            attribute[props.defaultTemplate.org] = attr;
            //setChange(!change); 
            setAttribute({ "none": [] });
            setStartValue();
        }
        else{
            setAttribute({ "none": [] });
        }
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

    const getTemplateValue = async (objTemplate: any, account: string, index:number) => {
        console.log(objTemplate);
        if (objTemplate.template.length == 0) {
            const res = await fetch(`${(window as any).proxy}${objTemplate.url}`, {
                headers: {
                    Authorization: `token ${props.access_token}`,
                    method: "get",
                    "Content-Type": "application/json",
                }
            });
    
            await res
                .json()
                .then((res:any) => {
                    console.log(JSON.parse(atob(res.content)));
                    if(account === "user"){
                        setSelected(objTemplate.name)
                        var temp = JSON.parse(atob(res.content));
                        var name = objTemplate.name.replace(".json", "");

                        if(!attribute[name] && temp){
                            console.log("nein", objTemplate.name.replace(".json", ""))
                            var addAttribute = [];

                            attribute[name] = temp;

                            // for(var i = 0; i < temp.length; i++){
                            //     addAttribute.push({name: temp[i].name, type: temp[i].type, description: temp[i].description, default: temp[i].default, editable: false})
                            // }

                            // console.log(addAttribute)

                        }

                        for(var i = 0; i < temp.length; i++){
                            console.log(temp[i]);
                        }


                        userTemplate[index].template = JSON.parse(atob(res.content));
                    }
                    else if(account === "org"){

                    }
                })
        }
        else {
            console.log("hat")
        }
    }

    const setTemplateToAttribute = () =>{
        console.log(selected);
        console.log(userTemplate);
    }

    const getOrgs = async (username: any) => {
        console.log("getOrgs")
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
            fetch(`${(window as any).proxy}https://api.github.com/repos/${orgs[i]}/Themify_DB/git/trees/main`, {
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
                            fetch(`${(window as any).proxy}${repo.tree[t].url}`, {
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
                                            fetch(`${(window as any).proxy}${f_config.tree[x].url}`, {
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
            props.onChange(JSON.stringify(attribute), "config")
        }
    }

    const getTemplateUser = () => {
        if (props.user) {
            fetch(`${(window as any).proxy}https://api.github.com/repos/${props.user.login}/Themify_DB/git/trees/main`, {
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
                            fetch(`${(window as any).proxy}${repo.tree[t].url}`, {
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
                                            fetch(`${(window as any).proxy}${f_config.tree[x].url}`, {
                                                method: "GET",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Accept": "application/json",
                                                    "Authorization": `token ${props.access_token}`
                                                }
                                            })
                                                .then(res => res.json())
                                                .then((f_template: any) => {
                                                    if (userTemplate.length <= 0) {
                                                        for (let j = 0; j < f_template.tree.length; j++) {
                                                            userTemplate.push({ "name": f_template.tree[j].path, "org": props.user.login, "url": f_template.tree[j].url, "template": [] })
                                                        }
                                                    }
                                                })
                                        }
                                    }
                                })
                        }
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        }
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
        //setValues(item);
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
                    </DropdownToggle>                     <DropdownMenu>
                        {
                            Object.keys(userTemplate).map((item: any) =>
                                <DropdownItem onClick={() => getTemplateValue(userTemplate[item], "user",item)}>{userTemplate[item].org}/{userTemplate[item].name}</DropdownItem>
                            )

                        }
                        {
                            Object.keys(orgTemplate).map((item: any) =>
                                <DropdownItem onClick={() => getTemplateValue(orgTemplate[item], "org",item)}>{orgTemplate[item].org}/{orgTemplate[item].name}</DropdownItem>
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

            <button onClick={() => console.log(attribute)}>click</button>
        </div>
    )
}
