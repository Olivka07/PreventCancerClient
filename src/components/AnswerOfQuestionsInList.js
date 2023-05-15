import { Children, useContext, useEffect, useState } from "react"
import { QuestionsContext } from "../context/questions.context"

export const AnswerOfQuestionsInList = ({itemAnswer, listAns, children}) => {
    const {list, updateList} = useContext(QuestionsContext)
    // const [answer, setAnswer] = useState(itemAnswer.text_answer)
    // const [weight, setWeight] = useState(itemAnswer.weight)

    // useEffect(() => {
    //     itemAnswer.text_answer = answer
    // }, [answer])

    // useEffect(() => {
    //     itemAnswer.weight = weight
    // }, [weight])

    

    return (
        <div className="answers-in-list">
            <input
                type="text"
                value={itemAnswer.text_answer}
                name={itemAnswer.text_answer}
                id={ itemAnswer.id_answer }
                onChange={e =>updateList(list.map((el) => {
                    el.listAnswers = el.listAnswers.map((elem) => {
                        if (elem.id_answer === itemAnswer.id_answer) {
                            elem.text_answer = e.target.value
                        }
                        return elem
                    })
                    return el
                }))}
                className="input-answer-in-list"
            />
            <input
                type="number"
                value={itemAnswer.weight}
                name={"weight"+ itemAnswer.weight}
                onChange={e => updateList(list.map((el) => {
                    el.listAnswers = el.listAnswers.map((elem) => {
                        if (elem.id_answer === itemAnswer.id_answer) {
                            elem.weight = Number(e.target.value)
                        }
                        return elem
                    })
                    return el
                }))}
                className="input-weight-answer-in-list"
            />
            {children}
        </div>
    )
}