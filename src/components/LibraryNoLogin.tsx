import React from 'react'
import ThemifyLogo from "../icons/Themify";
import {getPhrase as _} from "../shared";

export default function LibraryNoLogin() {

    return (
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto mt-5 text-center">
            <div className="card shadow-lg">
                <div className="card-body">
                    <div className="col-3 mx-auto">
                        <ThemifyLogo />
                    </div>
                    <h1>Themify/Library</h1>
                    {_("NEED_GITHUB_LOGIN")}
           </div>
            </div>
        </div>
    )
}
