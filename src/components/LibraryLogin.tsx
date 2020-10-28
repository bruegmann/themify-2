import React, { useEffect, useState } from 'react'
import ThemeItem from './ThemeItem';
import { Utilities } from "blue-react";
import { getPhrase as _ } from '../shared';


export default function LibraryLogin(props: any) {

    const [libraryItems, setLibraryItems] = useState<any[]>();
    const [bruegmannItems, setBruegmannItems] = useState<any[]>();

    useEffect(() => {
        if (props.user) {
            getLibraryItems(props.user.login);
            getBruegmannLibraryItems();
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

        for (var i = 0; i < tree.length; i++) {
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

    const getBruegmannLibraryItems = async () => {
        Utilities.startLoading();
        const bruegmann = "bruegmann"
        var TempItems: any = [];
        var tree: any;

        const res = await fetch(`${(window as any).proxy}https://api.github.com/repos/${bruegmann}/Themify_DB/git/trees/main`, {
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

        for (var i = 0; i < tree.length; i++) {
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
        await setBruegmannItems(TempItems);
        Utilities.finishLoading();
    }

    return (
        <div className="container">
            <div className="pt-3 row mx-auto">
                <div className="col-md-12"><h1 className="page-header">{_("LOCAL_THEMES")}</h1></div>

                {
                    libraryItems?.map((item: any) =>
                        <div className="col-md-6 " key={item.path}>
                            <ThemeItem
                                name={item.path}
                                hash={item.url}
                            />
                        </div>
                    )
                }
                <div className="col-md-12"><h1 className="page-header">{_("BRUEGMANN_THEME")}</h1></div>
                {
                    bruegmannItems?.map((item: any, key: any) =>
                        <div className="col-md-6" key={key}>
                            <ThemeItem
                                name={item.path}
                                hash={item.url}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
