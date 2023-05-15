import { useCallback, useContext, useEffect, useState } from "react"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { ItemOfQuestionnaire } from "../../components/ItemOfQuestionnaire"
import { Message } from "../../components/Message"
import { QuestionsContext } from "../../context/questions.context"
import { useMessage } from "../../hooks/message.hook"
import { request } from "../../request/request"

export const OriginalQuestionnairePage = () => {
    const {anketaFromDb, list, updateList, ftchAnketa} = useContext(QuestionsContext)
    const {message, showMessage, hideMessage} = useMessage()

    useEffect(() => {
        updateList([...anketaFromDb])
    }, [anketaFromDb])

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])


    const clickAddNewQuestion = () => {
        let newId = Number(new Date())
        updateList([...list, {id_question: newId, text_question:'', listAnswers:[{id_answer: newId-37, text_answer: '', weight: 0, id_question:newId}]}])
    }

    const clickSaveQuestions = async() => {
        let key = true
        list.forEach((el) => {
            if (el.text_question.trim() === '') {
                key = false
            }
            if (el.listAnswers.length===0) {
                key = false
            } else {
                el.listAnswers.forEach((elem) => {
                    if (elem.text_answer.trim() === '') {
                        key = false
                    }
                })
            }
        })
        if (!key) {
            showMessage('Невозможно сохранить, так как есть незаполненные поля')
        } else {
            const newQuestions =[]
            const updateQuestions = []
            const deleteQuestions = [] 
            list.forEach((elemList) => {
                if (anketaFromDb.find((elFromDb) => {
                    if (elemList.id_question === elFromDb.id_question) {
                        return elFromDb
                    }
                })) {
                    updateQuestions.push(elemList)
                } else {
                    newQuestions.push(elemList)
                }
            })
            anketaFromDb.forEach((el) => {
                if (!list.find((elem) => {
                    if (elem.id_question === el.id_question) {
                        return elem
                    }
                })) {
                    deleteQuestions.push(el.id_question)
                }
            })
            console.log(newQuestions, deleteQuestions, updateQuestions)
            const res = await request('/api/anketa/save-questions', 'POST', {newQuestions, deleteQuestions, updateQuestions})
            showMessage(res.message)
            if (res.ok) {
                ftchAnketa()
            }
        }
    }

    const clickDeleteFromQuestions = (itemQuestionnaire) => {
        updateList(list.filter((el) => {
            if (Number(el.id_question) !== Number(itemQuestionnaire.id_question)) {
                return el
            }
        }))
    }
    return (
        <>
            <Header/>
            <main className="main-content">
                {message && <Message message={message}/>}
                <p className="page-header">
                    Исходная анкета
                </p>
                <div className="just-content">
                    <button onClick={clickAddNewQuestion} className="button-add-in-list">Добавить</button>
                    <button onClick={clickSaveQuestions} className="button-add-in-list">&#128190;</button>
                </div>
                <div className="list">
                    {list && list.map((item, index) => {
                        return (
                            <ItemOfQuestionnaire key={index} itemQuestionnaire={item}>
                                <button onClick={e => clickDeleteFromQuestions(item)}>Удалить</button>
                            </ItemOfQuestionnaire>
                        )
                    })}
                </div>
            </main>
            <Footer/>
        </>
    )
}