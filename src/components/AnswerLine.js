import { useCallback, useContext, useEffect, useState } from "react"
import { QuestionContext } from "../context/question.context"
import { QuestionsContext } from "../context/questions.context"


export const AnswerLine = (props) => {
    const {changeQuestionsState, questionsState} = useContext(QuestionsContext)
    const {questionState, changeQuestionState} = useContext(QuestionContext)

    


    useEffect(() => {
        changeQuestionsState(questionState, false)
    }, [questionState])

    const checkAnswer = useCallback(() => {
        if (questionsState.length >0) {
            const quest = questionsState.find((el) => {
                if (Object.keys(el).toString() === props.question) {
                    return el
                }
            })
            if (quest && Object.values(quest)[0]===props.answer.text_answer) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
        
    }, [questionsState])

    

    return (
        <div className="answer-line">
            <input 
                type="radio" 
                id={props.question + props.answer.id_answer} 
                name={props.question} 
                value={props.answer.text_answer}
                checked={checkAnswer()}
                // checked={Object.values(questionsState)[0]===props.answer.text_answer ? true: false}
                onChange={e => {
                    changeQuestionState(e)
                }}
            />
            <label 
                htmlFor={props.question + props.answer.id_answer}
            >
                {props.answer.text_answer}
            </label>
        </div>
    )
}