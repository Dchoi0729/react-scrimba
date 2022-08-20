import React from "react"


export default function App() {

    const [start, setStart] = React.useState(false)

    function startQuiz(){
        setStart(true)
    }

    return (
        <main>
            {
                start ? 
                    <h1>START</h1> 
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