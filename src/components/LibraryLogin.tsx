import React, { useEffect, useState } from 'react'
import ThemeItem from './ThemeItem';
import { Utilities } from "blue-react";
import { getPhrase as _ } from '../shared';


export default function LibraryLogin(props: any) {

    const [libraryItems, setLibraryItems] = useState<any[]>();
    const [orgItems, setOrgItems] = useState<any[]>();

    useEffect(() => {
        if (props.user) {
            getLibraryItems(props.user.login);
            getOrgs(props.user.login);
        }

    }, [props.user])




    const getLibraryItems = async (org: any) => {
        Utilities.startLoading();
        var TempItems: any = [];
        var tree: any;



        const res = await fetch(`${(window as any).proxy}https://api.github.com/repos/${org}/Themify_DB/git/trees/main`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json",
            }
        });

        await res
            .json()
            .then((res: any) => {
                tree = res.tree
            })
            .catch((e: any) => {
                console.log(e);
            })

        for (var i = 0; i < tree?.length; i++) {
            const res = await fetch(`${(window as any).proxy}${tree[i].url}`, {
                headers: {
                    Authorization: `token ${props.access_token}`,
                    method: "get",
                    "Content-Type": "application/json"
                }
            });

            await res
                .json()
                .then((res: any) => {
                    for (let i = 0; i < res.tree.length; i++) {
                        TempItems.push(JSON.parse(JSON.stringify(res.tree[i])))
                    }

                })
        }

        await setLibraryItems(TempItems);
        Utilities.finishLoading();
    }

    const getOrgLibraryItems = async (orgs: any) => {
        var tree: any[] = [];
        var TempItems: any[] = [];
        for (let j = 0; j < orgs.length; j++) {
            Utilities.startLoading();

            let res: any;
            res = await fetch(`${(window as any).proxy}https://api.github.com/repos/${orgs[j].login}/Themify_DB/git/trees/main`, {
                headers: {
                    Authorization: `token ${props.access_token}`,
                    method: "get",
                    "Content-Type": "application/json",
                }
            });
            await res
                .json()
                .then((res: any) => {
                    tree.push(res.tree);
                })
                .catch((e: any) => {
                    console.log(e);
                })


        }
        for (var i = 0; i < tree?.length; i++) {
            for (var k = 0; k < tree[i].length; k++) {
                const res = await fetch(`${(window as any).proxy}${tree[i][k].url}`, {
                    headers: {
                        Authorization: `token ${props.access_token}`,
                        method: "get",
                        "Content-Type": "application/json"
                    }
                });

                await res
                    .json()
                    .then((res: any) => {

                        for (let l = 0; l < res.tree.length; l++) {
                            TempItems.push(JSON.parse(JSON.stringify(res.tree[l])))
                        }

                    })
            }

        }
        await setOrgItems(TempItems);
        Utilities.finishLoading();
    }

    const getOrgs = async (username: any) => {

        const res = await fetch(`${(window as any).proxy}https://api.github.com/users/${username}/orgs`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json",
            }
        });

        await res
            .json()
            .then((res: any) => {
                getOrgLibraryItems(res)
            })
    }

    return (
        <div className="container">
            <div className="pt-3 row mx-auto">
                <div className="col-md-12"><h1 className="page-header">{`${props.user.login} ${_("THEMES")}`}</h1></div>

                {
                    libraryItems?.map((item: any, key: any) =>
                        <div className="col-md-6 " key={key}>
                            <ThemeItem
                                name={item.path}
                                hash={item.url}
                                username={props.user.login}
                                access_token={props.access_token}
                            />
                        </div>
                    )
                }
                <div className="col-md-12"><h1 className="page-header">{_("ORG_THEME")}</h1></div>
                {
                    orgItems?.map((item: any, key: any) =>
                        <div className="col-md-6" key={key}>
                            <ThemeItem
                                name={item.path}
                                hash={item.url}
                                username={item.url.slice(29, 38)}
                                access_token={props.access_token}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
