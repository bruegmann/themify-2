import React, { useEffect, useState } from 'react'
import ThemeItem from './ThemeItem';
import { Utilities } from "blue-react";

const org = "wag-bsw"


export default function LibraryLogin(props: any) {

    const [libraryItems, setLibraryItems] = useState<any[]>();

    useEffect(() => {
        if (props.user) {
            getLibraryItems();
        }
    }, [props.user])




    const getLibraryItems = async () => {
        Utilities.startLoading();
        var TempItems: any = [];
        var tree: any;

        const res = await fetch(`${(window as any).proxy}https://api.github.com/repos/${org}/library/git/trees/master`, {
            headers: {
                Authorization: `token ${props.access_token}`,
                method: "get",
                "Content-Type": "application/json"
            }
        });

        await res
            .json()
            .then(res => {
                tree = res.tree
            })

        for (var i = 0; i < tree.length; i++) {
            console.log(i)
            const res = await fetch(`${(window as any).proxy}${tree[i].url}`, {
                headers: {
                    Authorization: `token ${props.access_token}`,
                    method: "get",
                    "Content-Type": "application/json"
                }
            });

            await res
                .json()
                .then(res => {
                    const buffer = Buffer.from(res.content, "base64")
                    const item = buffer.toString("utf8")
                    TempItems.push(JSON.parse(item))
                })
        }

        await setLibraryItems(TempItems);
        Utilities.finishLoading();
    }


    return (
        <div className="d-flex justify-content-center">
            <div className="pt-3 row mx-auto">
                {
                    libraryItems?.map((item: any) =>
                        <div className="col-md-6 " key={item.name}>
                            <ThemeItem
                                name={item.name}
                                hash={item.limk}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
