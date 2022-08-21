import React from "react"
import Popup from "reactjs-popup"
import settings from "../assets/settings.png"
import "reactjs-popup/dist/index.css"

/*
current best score - (X/X)
-----------------------------
question number - slider
difficulty - radio
category - select
-----------------------------
    RESET button
*/

export default function PopupGfg(){
    return(
        <div>
            <Popup trigger={<img src={settings} className="main--settings" />}
            position="left bottom">
                <div>GeeksforGekks</div>
                <div>GeeksforGekks</div>
                <div>GeeksforGekks</div>
                <div>GeeksforGekks</div>
                <div>GeeksforGekks</div>
                <div>GeeksforGekks</div>
                <div>GeeksforGekks</div>
                <input type="range" min="1" max="600" />
                <div>GeeksforGekks</div>
                <button>Click</button>
            </Popup>
        </div>
    )
}