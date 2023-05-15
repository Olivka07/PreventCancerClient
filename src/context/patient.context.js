import { createContext, useState, useContext } from "react";
import { QuestionsContext } from "./questions.context";
// import { QuestionsDataContext } from "./questions.data.context";

export const PatientContext = createContext({
    direction: '',
    recomendation: '',
    count: null,
    passed: false,
    updateDirection: () => {},
    updateRecomendation: () => {},
    updatePassed: () => {},
    onClickSubmit: () => {},
    getRecomendation: () => {},
    onClickTestAgain: () => {},
})

export const PatientState = ({children}) => {

    const [direction, setDirection] = useState('')
    const [recomendation, setRecomendation] = useState('')
    const [count, setCount] = useState(0)
    const [passed, setPassed] = useState(false)
    const {questionsState, anketaFromDb, updateAnketaFromDb, changeQuestionsState} = useContext(QuestionsContext)

    const updateRecomendation = (newRecomendation) => {
        setRecomendation(newRecomendation)
    }

    const updateDirection = (newDirection) => {
        setDirection(newDirection)
    }

    const updatePassed = (newPassed) => {
        setPassed(newPassed)
    }

    function onClickSubmit() {
        setCount(prev => prev-prev)
        if (questionsState.length === anketaFromDb.length) {
            anketaFromDb.forEach(question => {
                questionsState.forEach(checkQuestion => {
                    if (question.text_question === Object.keys(checkQuestion)[0]) {
                        question.listAnswers.forEach(rating => {
                            if(rating.text_answer === Object.values(checkQuestion)[0]) {
                                setCount((prev) => {
                                    setRecomendation(getRecomendation(Number(prev) + Number(Object.values(rating)[0])))
                                    return Number(prev) + Number(rating.weight)
                                })
                            }
                        })
                    }
                })
            })
            setPassed(prev => !prev)
        }
        else {
            alert('Не все поля заполнены!')
            return
        }
    }

    const getRecomendation = (count) => {
        let recomendation = ''
        if (count<=13) {
            recomendation = 'Низкий риск выполнения первичной резекции кишки с опухолью (амбулаторное лечение)'
        }
        else if (count>13) {
            recomendation = `Высокий риск выполнения первичной резекции кишки с опухолью (возможна операция)`
        }
        return recomendation
    }

    

    function onClickTestAgain() {
        setPassed(prev => !prev)
        changeQuestionsState({}, true)
        setRecomendation('')
    }


    return (
        <PatientContext.Provider value={{updateDirection, updateRecomendation, updatePassed, direction, recomendation, count, passed, onClickSubmit, getRecomendation, onClickTestAgain}}>
            {children}
        </PatientContext.Provider>
    )
}