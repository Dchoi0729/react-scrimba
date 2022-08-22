import React from "react"
import Question from "./components/Question"
import { nanoid } from "nanoid"
import Popup from "./components/Popup"
import Confetti from "react-confetti"

//Add Header

export default function App() {

    function decodeEntity(inputStr) {
        const textarea = document.createElement("textarea")
        textarea.innerHTML = inputStr
        return textarea.value
    }

    const [userSetting, setUserSetting] = React.useState({
        questionNumber: 5,
        difficulty: "hard",
        category: "Any Category"
    })
    const [start, setStart] = React.useState(false)
    const [questionData, setQuestionData] = React.useState({})
    const [givenAnswers, setGivenAnswers] = React.useState([])
    const [gameStatus, setGameStatus] = React.useState({
        score:0,
        done:false,
        again:false,
        confetti:false,
        goodData:true
    })


    function startQuiz(){
        setStart(true)
    }

    function generateUrl(){
        let category=""
        switch(userSetting.category){
            case "General Knowledge":
                category="&category=9"
                break
            case "Science: Computers":
                category="&category=18"
                break
            case "Science: Mathematics":
                category="&category=19"
                break
            case "Animals":
                category="&category=27"
                break
        }

        return `https://opentdb.com/api.php?amount=${userSetting.questionNumber}&type=multiple&difficulty=${userSetting.difficulty}${category}`
    }

    React.useEffect(() => {
        async function getQuestions() {
            const res = await fetch(generateUrl())
            const data = await res.json()
            if(data.response_code != 0){
                setGameStatus(prev => ({...prev, goodData:false}))
            }
            const finalData = data.results.map(question => {
                const id = nanoid()
                setGivenAnswers(prev => [...prev, {id: id}])
                return {...question, id: id}
            })
            setQuestionData(finalData)
        }
        getQuestions()
    }, [gameStatus.again])

    function changeUserSetting(event){
        const {name, value, type, checked} = event.target
        setUserSetting(prevData => {
            return {
                ...prevData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    function playAgain(){
        setGameStatus(prev => ({score:0,done:false, again:!prev.again, confetti:false, goodData:true}))
        setGivenAnswers([])
    }

    function chooseAnswer(event, id){
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
        const currHighScore = localStorage.getItem("score") || 0
        if(parseInt(currHighScore) <= score/userSetting.questionNumber * 100){
            const grade = score/userSetting.questionNumber * 100 
            localStorage.setItem("score", grade.toString())
        }
        if(score==userSetting.questionNumber){
            setGameStatus(prev => ({...prev, confetti: true}))
        }

        setGameStatus(prev => ({...prev, score: score, done: true}))
    }
    
    return (
        <>
            <header>
                QUIZZICAL
            </header>
            {gameStatus.confetti && <Confetti />}
            <main className={`${start && gameStatus.goodData ? "questionbox" : "centerbox"}`}>
                {
                    start ?
                        gameStatus.goodData ? 
                            <div className="main--questions">
                                {questionData.map(data => <Question
                                    key={data.id}
                                    id={data.id}
                                    chooseAnswer={(event) => chooseAnswer(event, data.id)}
                                    question={data.question}
                                    answers={[...data.incorrect_answers,data.correct_answer]}
                                    givenAnswers={givenAnswers}
                                    gameStatus={gameStatus}
                                />)}
                                <div className="main--bottom">
                                    {gameStatus.done && 
                                        <h3 className="main--score">
                                            You scored {gameStatus.score} / {userSetting.questionNumber} correct answers
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
                            <div className="main--apology">
                                <img 
                                    alt="apology" 
                                    class="border img-fluid" 
                                    src="http://memegen.link/custom/OOPS! please use/different question settings.jpg?alt=https://i.imgur.com/CsCgN7Ll.png&width=400" 
                                    title="apology" 
                                />
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

                {start && <Popup playAgain={playAgain} handleChange={changeUserSetting} userSetting={userSetting} />}
            </main>
        </>
    )
}