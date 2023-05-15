import { createContext, useCallback, useEffect, useState } from "react";
import { request } from "../request/request";

export const QuestionsContext = createContext({
    anketaFromDb: [],
    questionsState: [],
    list: [], 
    updateList: () => {},
    updateAnketaFromDb: () => {},
    changeQuestionsState: () => {},
})

export const QuestionsState = ({children}) => {
    const [questionsState, setQuestionsState] = useState([])
    const [anketaFromDb, setAnketaFromDb] = useState([])
    const [list, setList] = useState([])

    

    const changeQuestionsState = (question, keyClear) => {
        let newStateQuestions = []
        if (!keyClear) {
            let key = false
            setQuestionsState(prev => {
                prev.forEach(checkQuestion => {
                    if (Object.keys(checkQuestion)[0] === Object.keys(question)[0]) {
                        key = true
                        newStateQuestions.push(question)
                    }
                    else {
                        newStateQuestions.push(checkQuestion)
                    }
                })
                if (!key && Object.keys(question)[0]) {
                    newStateQuestions.push(question)
                }
                return newStateQuestions
            })
        }
        else {
            setQuestionsState(newStateQuestions)
        }
    }

    const updateList = (newList) => {
        setList(newList)
    }

    const updateAnketaFromDb = (newAnketa) => {
        setAnketaFromDb([...newAnketa])
    }

    return (
        <QuestionsContext.Provider value={{questionsState, anketaFromDb, list, updateList, updateAnketaFromDb, changeQuestionsState}}>
            {children}
        </QuestionsContext.Provider>
    )
}