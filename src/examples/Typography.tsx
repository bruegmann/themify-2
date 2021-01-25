
import React from 'react'

let headings: any[] = [];
let displays: any[] = [];

for (let i = 1; i <= 6; i++) {
    headings.push(i);
}

for (let i = 1; i <= 4; i++) {
    displays.push(i);
}


export default function Typography(props: any) {

    return (
        <div>
            <section>
                <h1 className="mt-4 mb-3">Headings</h1>

                {headings.map((heading: any, i: any) =>
                    <div key={heading} className={`h${heading} mt-4 mb-3`}>h{heading}. Bootstrap heading</div>
                )}
            </section>

            <section>
                <h1 className="mt-5 mb-3">Customizing headings</h1>

                <h3>
                    Fancy display heading
                        <small className="text-muted">With faded secondary text</small>
                </h3>
            </section>

            <section>
                <h1 className="mt-5 mb-3">Display headings</h1>

                {displays.map((display: any, i: any) =>
                    <h1 key={display} className={`display-${display}`}>Display {display}</h1>
                )}
            </section>
        </div>
    )
}
