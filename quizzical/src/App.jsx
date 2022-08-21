import React from "react"
import Question from "./components/Question"
import { nanoid } from "nanoid"

export default function App() {

    function decodeEntity(inputStr) {
        const textarea = document.createElement("textarea")
        textarea.innerHTML = inputStr
        return textarea.value
    }

    const [start, setStart] = React.useState(false)
    const [questionData, setQuestionData] = React.useState({})
    const [givenAnswers, setGivenAnswers] = React.useState([])
    const [gameStatus, setGameStatus] = React.useState({score:0,done:false, again:false})

    function startQuiz(){
        setStart(true)
    }

    React.useEffect(() => {
        async function getQuestions() {
            const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            const data = await res.json()
            const finalData = data.results.map(question => {
                const id = nanoid()
                setGivenAnswers(prev => [...prev, {id: id}])
                return {...question, id: id}
            })
            setQuestionData(finalData)
        }
        getQuestions()
    }, [gameStatus.again])


    function playAgain(){
        setGameStatus(prev => ({score:0,done:false, again:!prev.again}))
        setGivenAnswers([])
    }


    function chooseAnswer(id){
        setGivenAnswers(oldAns => oldAns.map(prev => {
            return prev.id === id ?
                {...prev, answer: event.target.innerText} :
                prev
        }))
    }

    function checkAnswers(){
        let score = 0
        for(let i = 0; i < givenAnswers.length; i++){
            const id = givenAnswers[i].id
            let correctAns = ""
            for(let j = 0; j < questionData.length; j++){
                if(questionData[j].id === id){
                    correctAns = questionData[j].correct_answer
                }
            }
            if(decodeEntity(correctAns) === givenAnswers[i].answer){
                score++
            }
            setGivenAnswers(prev => prev.map(question => {
                return question.id === id ? 
                    {...question, correct_answer:decodeEntity(correctAns)} :
                    question
            }))
        }
        setGameStatus(prev => ({...prev, score: score, done: true}))
    }
    
    console.log(givenAnswers)

    return (
        <main className={`${start ? "questionbox" : "centerbox"}`}>
            {
                start ?
                    <div className="main--questions">

                        {questionData.map(data => <Question
                            key={data.id}
                            id={data.id}
                            chooseAnswer={() => chooseAnswer(data.id)}
                            question={data.question}
                            answers={[...data.incorrect_answers,data.correct_answer]}
                            givenAnswers={givenAnswers}
                            gameStatus={gameStatus}
                        />)}
                        <div className="main--bottom">
                            {gameStatus.done && 
                                <h3 className="main--score">
                                    You scored {gameStatus.score} / 5 correct answers
                                </h3>}
                            <button 
                                className="main--button" 
                                onClick={gameStatus.done ? playAgain:checkAnswers}
                            >
                                {gameStatus.done ? "Play Again" : "Check Answers"}
                            </button>
                        </div>
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