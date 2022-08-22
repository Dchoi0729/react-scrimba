import React from "react"
import Answer from "./Answer"

export default function Trivia(props){

    const question = props.question
    const answerChoices = props.answers.sort()

    return(
        <div className="trivia">
            <h1 className="trivia--question">{question}</h1>
            <div className="trivia--answerList">
                {answerChoices.map((answer, index) => {
                    return(
                        <Answer 
                            key={index} 
                            text={answer} 
                            id={props.id}
                            handleClick={props.chooseAnswer}
                            givenAnswers={props.givenAnswers}
                            gameStatus={props.gameStatus}
                        />
                    )
                })}
            </div>
        </div>
    )
}