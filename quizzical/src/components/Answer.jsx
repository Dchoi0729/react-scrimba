import React from "react"

export default function Answer(props){

    const id = props.id
    const done = props.gameStatus.done
    const givenAnswers = props.givenAnswers
    const text = props.text

    let styles = {}
    let isClicked = false
    let isCorrect = false
    let color = "#F5F7FB"
    let border = "0.771045px solid #4D5B9E"

    for(let i = 0; i < givenAnswers.length; i++){
        if(givenAnswers[i].answer === text){
            isClicked=true
        }
        if(isClicked){
            if(givenAnswers[i].correct_answer === text){
                isCorrect=true
            }
            color = isCorrect ? "#94D7A2" : "#F8BCBC"
            border = "none"
        }else{
            if(givenAnswers[i].correct_answer === text){
                color = "#94D7A2"
                border = "none"
            }
        }
    }

    if(done){
        styles = {
            backgroundColor: color,
            opacity: isClicked ? 1 : 0.5,
            border: border
        }
    }else{
        styles = {
            backgroundColor: isClicked ? "#D6DBF5" : "#F5F7FB",
            border: border
        }
    }

    return(
        <button
            className="question--answer"
            style={styles}
            onClick={props.handleClick}
            disabled={done ? true : false}
        >
            {text}
        </button>)
}