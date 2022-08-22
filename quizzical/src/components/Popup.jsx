import React from "react"
import Popup from "reactjs-popup"
import settings from "../assets/settings.png"
import "reactjs-popup/dist/index.css"


export default function PopupGfg(props){
    const userSetting = props.userSetting
    const score = localStorage.getItem("score") || 0

    return(
        <div>
            <Popup 
                trigger={<img src={settings} className="popup--settings" />}
                position="left bottom"
                contentStyle={
                    {
                        width: "300px",
                        height: "500px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px"
                    }
                }
            >
                <div>High Score: {`${score}%`}</div>
                <fieldset>
                    <legend>Question Number</legend>
                    <div className="popup--questionNum">
                        <input 
                            type="range" 
                            name="questionNumber"
                            min="1" 
                            max="10" 
                            value={userSetting.questionNumber} 
                            onInput={props.handleChange}
                        />
                        <h3>{userSetting.questionNumber}</h3>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Difficulty Rating</legend>
                    <input 
                        type="radio"
                        id="easy"
                        name="difficulty"
                        value="easy"
                        checked={userSetting.difficulty === "easy"}
                        onChange={props.handleChange}
                    />
                    <label htmlFor="easy">Easy</label>
                    <br />
                    
                    <input 
                        type="radio"
                        id="medium"
                        name="difficulty"
                        value="medium"
                        checked={userSetting.difficulty === "medium"}
                        onChange={props.handleChange}
                    />
                    <label htmlFor="medium">Medium</label>
                    <br />
                    
                    <input 
                        type="radio"
                        id="hard"
                        name="difficulty"
                        value="hard"
                        checked={userSetting.difficulty === "hard"}
                        onChange={props.handleChange}
                    />
                    <label htmlFor="hard">Hard</label>
                    <br />
                </fieldset>
                <fieldset>
                    <legend>Question Type</legend>
                    <select 
                        id="category" 
                        value={userSetting.category}
                        onChange={props.handleChange}
                        name="category"
                    >
                        <option value="Any Category">Any Category</option>
                        <option value="General Knowledge">General Knowledge</option>
                        <option value="Science: Computers">Science: Computers</option>
                        <option value="Science: Mathematics">Science: Mathematics</option>
                        <option value="Animals">Aniamls</option>
                    </select>
                </fieldset>
                <button className="popup--apply" onClick={props.playAgain}>Apply</button>
            </Popup>
        </div>
    )
}