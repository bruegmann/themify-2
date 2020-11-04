
import React, { useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

import CommonComponents from "../examples/CommonComponents";
import Typography from "../examples/Typography";
import Grid from "../examples/Grid";
import Albums from "../examples/Albums";



export default function Examples(props: any) {
    const [examples, setExamples] = useState<any[]>(
        [
            {
                component: <CommonComponents />,
                label: "Common components"
            },
            {
                component: <Typography />,
                label: "Typography"
            },
            {
                component: <Grid />,
                label: "Grid"
            },
            {
                component: <Albums />,
                label: "Album"
            }
        ]
    )

    return (
        <div className="col-md-7">

            <h1 className="display-4 mt-4 mb-3">{"Examples"}</h1>

            <Nav tabs>
                {examples.map((example: any, i: any) =>
                    <NavItem key={i}>
                        <NavLink
                            href="javascript:void(0)"
                            className={props.activeTab == i ? "active" : ""}
                            onClick={() => props.onClick(i)}
                        >
                            {example.label}
                        </NavLink>
                    </NavItem>
                )}
            </Nav>

            <TabContent activeTab={props.activeTab} className="m-3">
                {examples.map((example: any, i: any) =>
                    <TabPane key={i} tabId={i}>
                        {example.component}
                    </TabPane>
                )}
            </TabContent>
        </div>
    )
}
