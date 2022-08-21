import React from "react"
import Answer from "./Answer"

export default function Question(props){
    let question = props.question
    let answerChoices = props.answers.sort()

    function decodeEntity(inputStr) {
        const textarea = document.createElement("textarea")
        textarea.innerHTML = inputStr
        return textarea.value
    }

    question = decodeEntity(question)
    answerChoices = answerChoices.map(choice => decodeEntity(choice))

    return(
        <div className="question">
            <h1 className="question--question">{question}</h1>
            <div className="question--answerList">
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