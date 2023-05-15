import { useContext, useEffect, useState } from "react"
import { QuestionsContext } from "../context/questions.context"
import { AnswerOfQuestionsInList } from "./AnswerOfQuestionsInList"

export const ItemOfQuestionnaire = ({itemQuestionnaire, children}) => {
    const {list, updateList, anketaFromDb} = useContext(QuestionsContext)
    const [question, setQuestion] = useState('')
    const [listAns, setListAns] = useState([])
    
    const clickAddNewAnswer = () => {
        let newId = Number(new Date())
        updateList(list.map((el) => {
            if (el.id_question === itemQuestionnaire.id_question) {
                el.listAnswers = [{id_answer: newId, text_answer: '', weight: 0, id_question:itemQuestionnaire.id_question}, ...el.listAnswers]
            }
            return el
        }))
        // setListAns([...listAns, {id_answer: newId, text_answer: '', weight: 0, id_question:itemQuestionnaire.id_question}])
        
        // itemQuestionnaire.listAnswers = [...listAns, {}]
    }


    // useEffect(() => {
    //     setQuestion(itemQuestionnaire.text_question)
    //     setListAns(itemQuestionnaire.listAnswers)
    // }, [itemQuestionnaire])

    // useEffect(() => {
    //     itemQuestionnaire.listAnswers = listAns
    // }, [listAns])

    // useEffect(() => {
    //     itemQuestionnaire.text_question = question
    // }, [question])

   

    const clickDeleteAnswer = (itemAnswer) => {

        updateList(list.map((el) => {
            if (el.id_question === itemQuestionnaire.id_question) {
                el.listAnswers = el.listAnswers.filter((elem) => {
                    if (elem.id_answer !== itemAnswer.id_answer) {
                        return elem
                    }
                })
            }
            return el
        }))

        // setListAns(listAns.filter((elem) => {
        //     if (elem.id_answer!== itemAnswer.id_answer) {
        //         return elem
        //     }
        // }))
    }


    return (
        <div className="item-of-questionnaire">
            <div className="name-of-question">
                <label htmlFor={itemQuestionnaire.text_question}>Вопрос</label>
                <input
                    type="text"
                    name={itemQuestionnaire.text_question}
                    value={itemQuestionnaire.text_question}
                    onChange = {e => updateList(list.map((el) => {
                        if (el.id_question === itemQuestionnaire.id_question) {
                            el.text_question = e.target.value
                        }
                        return el
                    }))}
                />
                
                
                {/* <button onClick={clickDeleteFromQuestions}>Удалить</button> */}
                {children}
            </div>
            <div className="flexing-answers">
                <div className="answers">
                    <span>Список ответов</span>
                    <button onClick={clickAddNewAnswer} className="btn-add-answer">&#10010;</button>
                    {itemQuestionnaire.listAnswers && itemQuestionnaire.listAnswers.map((answer, index) => {
                        return (
                            <AnswerOfQuestionsInList key={index} listAns={itemQuestionnaire.listAnswers} itemAnswer={answer}>
                                <button 
                                    className="btn-delete-answer"
                                    onClick={e => clickDeleteAnswer(answer)}
                                >
                                    &#10006;
                                </button>
                            </AnswerOfQuestionsInList>
                        )
                    })}
                </div>
            </div>
        </div>
    )
    

    // return (
    //     <div className="item-of-questionnaire">
    //         <div className="name-of-question">
    //             <input
    //                 type="text"
    //                 name={itemQuestionnaire.text_question}
    //                 value={question}
    //                 onChange = {e => setQuestion(e.target.value)}
    //             />
    //             {/* <button onClick={clickDeleteFromQuestions}>Удалить</button> */}
    //             {children}
    //         </div>
    //         <div className="answers">
    //             {listAns && listAns.map((answer, index) => {
    //                 return (
    //                     <AnswerOfQuestionsInList key={index} listAns={listAns} itemAnswer={answer}>
    //                         <button 
    //                             onClick={e => clickDeleteAnswer(answer)}
    //                         >
    //                             &#10006;
    //                         </button>
    //                     </AnswerOfQuestionsInList>
    //                 )
    //             })}
    //             <button onClick={clickAddNewAnswer} className="btn-add-answer">+</button>
    //         </div>
    //     </div>
    // )
}