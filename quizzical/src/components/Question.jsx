import React from "react"

export default function Question(props){

    const answerChoices = props.answers

    console.log(props)

    return(
        <div className="question">
            <h1 className="question--question">{props.question}</h1>
            <div className="question--answerList">
                {answerChoices.map((answer, index) => {
                    return(<button key={index} className="question--answer">{answer}</button>)
                })}
            </div>
        </div>
    )
}