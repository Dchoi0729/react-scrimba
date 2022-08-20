import React from "react"
import Question from "./components/Question"
import { nanoid } from "nanoid"

export default function App() {

    const [start, setStart] = React.useState(false)
    const [questionData, setQuestionData] = React.useState({})
    const [givenAnswers, setGivenAnswers] = React.useState([])

    function startQuiz(){
        setStart(true)
    }

    React.useEffect(() => {
        async function getQuestions() {
            const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            const data = await res.json()
            setQuestionData(data.results)
        }
        getQuestions()
    }, [])
    
    function convertEncoding(text){
        return "hi"
    }
    
    return (
        <main className={`${start ? "questionbox" : "centerbox"}`}>
            {
                start ?
                    <div className="main--questions">

                        {questionData.map(data => <Question
                            key={nanoid()}
                            question={data.question}
                            answers={[...data.incorrect_answers,data.correct_answer]}
                        />)}

                    </div>
                    : 
                    <div className="main--welcome">
                        <h1 className="welcome--title">Quizzical</h1>
                        <h3 className="welcome--description">some description if needed</h3>
                        <button 
                            className="welcome--startButton"
                            onClick={startQuiz}
                        > Start quiz </button>
                    </div>
            }
        </main>
    )
}