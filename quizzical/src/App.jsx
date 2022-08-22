import React from "react"
import Trivia from "./components/Trivia"
import { nanoid } from "nanoid"
import Popup from "./components/Popup"
import Confetti from "react-confetti"

export default function App() {

    const [start, setStart] = React.useState(false)
    const [questionData, setQuestionData] = React.useState({})
    const [givenAnswers, setGivenAnswers] = React.useState([])
    const [userSetting, setUserSetting] = React.useState({
        questionNumber: 5,
        difficulty: "hard",
        category: "Any Category"
    })
    const [gameStatus, setGameStatus] = React.useState({
        score:0,
        done:false,
        again:false,
        confetti:false,
        goodData:true
    })

    React.useEffect(() => {
        async function getQuestions() {
            const res = await fetch(generateUrl())
            const data = await res.json()
            if(data.response_code != 0){
                setGameStatus(prev => ({...prev, goodData:false}))
            }
            let finalData = data.results.map(question => {
                const id = nanoid()
                setGivenAnswers(prev => [...prev, {id: id}])
                return {...question, id: id}
            })
            finalData = decodeData(finalData)
            setQuestionData(finalData)
        }
        getQuestions()
    }, [gameStatus.again])

    // Generate a api url given user setting
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

    // Gathers input from various controlled forms in popup and changes user setting
    function changeUserSetting(event){
        const {name, value, type, checked} = event.target
        setUserSetting(prevData => {
            return {
                ...prevData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    // Resets games, resetting all necessary state to initial starting condition
    function playAgain(){
        setGameStatus(prev => ({score:0,done:false, again:!prev.again, confetti:false, goodData:true}))
        setGivenAnswers([])
    }

    // Gets information from the Answer component and updates givenAnswer state
    function chooseAnswer(event, id){
        setGivenAnswers(oldAns => oldAns.map(prev => {
            return prev.id === id ?
                {...prev, answer: event.target.innerText} :
                prev
        }))
    }

    // Checks givenAnswer with actual answers in questionData
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
            if(correctAns === givenAnswers[i].answer){
                score++
            }
            setGivenAnswers(prev => prev.map(question => {
                return question.id === id ? 
                    {...question, correct_answer:correctAns} :
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
            {gameStatus.confetti && <Confetti />}
            <main className={`${start && gameStatus.goodData ? "question-box" : "welcome-box flexbox-col"}`}>
                {
                    start ?
                        gameStatus.goodData ? 
                            <div className="main--questions flexbox-col">
                                {questionData.map(data => <Trivia
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
                                        </h3>
                                    }
                                    <button 
                                        className="main--button" 
                                        onClick={gameStatus.done ? playAgain:checkAnswers}
                                    >
                                        {gameStatus.done ? "Play Again" : "Check Answers"}
                                    </button>
                                </div>
                            </div>
                            :
                            <div className="flexbox-col">
                                <img 
                                    alt="apology" 
                                    class="border img-fluid" 
                                    src="http://memegen.link/custom/OOPS! please use/different question settings.jpg?alt=https://i.imgur.com/CsCgN7Ll.png&width=400" 
                                    title="apology" 
                                />
                            </div>
                        : 
                        <div className="flexbox-col">
                            <h1 className="welcome--title">Quizzical</h1>
                            <h3 className="welcome--description">some description if needed</h3>
                            <button 
                                className="welcome--startButton"
                                onClick={() => setStart(true)}
                            > Start quiz </button>
                        </div>
                }

                {start && <Popup playAgain={playAgain} handleChange={changeUserSetting} userSetting={userSetting} />}
            </main>
        </>
    )
}

// Decodes all entities in the data returned by api 
function decodeData(inputData){

    const finalData = []

    for(let i = 0; i < inputData.length; i++){
        const data = inputData[i]
        const modifiedData = {}
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if(data[key] instanceof Array){
                    let answerArray = []
                    for(let j = 0; j < data[key].length; j++){
                        answerArray.push(decodeEntity(data[key][j]))
                    }
                    modifiedData[key] = answerArray
                }
                else{
                    modifiedData[key] = decodeEntity(data[key])
                }
            }
        }
        finalData.push(modifiedData)
    }

    return finalData
}

// Decode all entities in a given string and return a clean version
function decodeEntity(inputStr) {
    const textarea = document.createElement("textarea")
    textarea.innerHTML = inputStr
    return textarea.value
}