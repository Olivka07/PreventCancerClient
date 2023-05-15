import { createContext, useState } from "react";

export const QuestionContext = createContext({
    questionState: {},
    changeQuestionState: () => {}
})

export const QuestionState = ({children}) => {
    const [questionState, setQuestionState] = useState({})
    const changeQuestionState = (event) => {
        const {name, value} = event.target
        setQuestionState(() => {return{
            [name]:value
        }})
    }
    return (
        <QuestionContext.Provider value={{questionState, changeQuestionState}}>
            {children}
        </QuestionContext.Provider>
    )
}