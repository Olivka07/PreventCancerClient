import React, { useContext, useEffect, useState } from "react"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { QuestionnaireLine } from "../../components/QuestionnaireLine"
import { QuestionsContext } from "../../context/questions.context"
import { request } from "../../request/request"
import {AuthContext} from '../../context/auth.context'
import { useMessage } from "../../hooks/message.hook"
import { Message } from "../../components/Message"
// import { QuestionsDataContext } from "../../context/questions.data.context"
// import { request } from "../../request/request"





// Для неавторизованных пользователей
export const PatientPage = () => {
    const [recomendation, setRecomendation] = useState('')
    const [count, setCount] = useState(0)
    const [passed, setPassed] = useState(false)
    const [nextQuestions, setNextQuestions] = useState(false)
    const [idNotPassed, setIdNotPassed] = useState([])
    const {message, showMessage, hideMessage} = useMessage()


    const {questionsState, anketaFromDb, changeQuestionsState, updateAnketaFromDb} = useContext(QuestionsContext)
    const {isAuthenticatedPatient, userId} = useContext(AuthContext)

    const ftchAnketa = async () => {
        try {
            const res = await request('/api/anketa/original')
            if (res.ok) {
                updateAnketaFromDb(res.list.sort((a,b) => {
                    if (a.id_question>b.id_question) {
                        return 1
                    }
                    if (b.id_question>a.id_question) {
                        return -1
                    }
                    return 0
                }))
            }
        } catch(e) {

        }
    }

    const ftchPostAnketa = async (anketa) => {
        try {
            const res = await request('/api/patient/completeanketa', 'POST', {anketa: anketa, id_patient: userId})
        } catch (e) {}
    }

    const ftchPostRisk = async (risk) => {
        try {
            const res = await request('/api/patient/risk', 'POST', {risk: risk, id_patient: userId})
        } catch (e) {}
    }

    useEffect(() => {
        ftchAnketa()
        changeQuestionsState(1,1)
    }, [])

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])


    // const [list, setList] = useState([])

    // useEffect(() => {
    //     async function ftch() {
    //         const result1 = await request('/api/anketa/original')
    //         setList(result1.list)
    //     }
    //     ftch()
    // }, [])



    function onClickSubmit() {
        const keys = []
        questionsState.forEach((el) => {
            keys.push(Object.keys(el)[0])
        })
        const ids = []
        anketaFromDb.forEach((el)=> {
            if (!keys.find((e) => {
                if (e===el.text_question) {
                    return e
                }
            })) {
                ids.push(el.id_question)
            }
        })
        if (ids.length!==0) {
            setIdNotPassed(ids)
        }
        setCount(prev => prev-prev)
        if (questionsState.length === anketaFromDb.length) {
            let countV = 0
            for (let i =0; i <anketaFromDb.length; i++) {
                for (let j = 0; j < questionsState.length; j++) {
                    if (anketaFromDb[i].text_question === Object.keys(questionsState[j])[0]) {
                        for (let k = 0; k<anketaFromDb[i].listAnswers.length; k++) {
                            if(anketaFromDb[i].listAnswers[k].text_answer === Object.values(questionsState[j])[0]) {
                                countV += Number(anketaFromDb[i].listAnswers[k].weight)
                            }
                        }
                    }
                }
            }
            setCount(countV)
            setRecomendation(getRecomendation(countV))
            ftchPostAnketa(questionsState) 
            setPassed(prev => !prev)
        }
        else {
            showMessage('Вы должны ответить на все вопросы')
            return
        }
    }

    const getRecomendation = (count) => {
        let recomendation = ''
        if (count<=13) {
            recomendation = 'Низкий риск выполнения первичной резекции кишки с опухолью (амбулаторное лечение)'
            ftchPostRisk(0)
        }
        else if (count>13) {
            recomendation = `Высокий риск выполнения первичной резекции кишки с опухолью (возможна операция)`
            ftchPostRisk(1)
        }
        return recomendation
    }

    function onClickTestAgain() {
        setPassed(prev => !prev)
        changeQuestionsState({}, true)
        setRecomendation('')
        setNextQuestions(false)
        setIdNotPassed([])
    }

    const onClickNext = () => {
        if (questionsState.length === 2) {
            setNextQuestions(true)
        } else {
            showMessage("Вы должны ответить на все вопросы")
        }
    }

    

    return (
        <>
            <Header/>
            {message && <Message message={message}/>}
            <main className="usersContent">
                {!passed &&
                    <>
                        <p className="page-header">Анкета</p>
                        <div className="anketa">
                            { !nextQuestions &&  anketaFromDb && 
                                anketaFromDb.map((data, index) => {
                                    if (index<2) {
                                        return <QuestionnaireLine data={data} key={index}/>
                                    }
                                })
                            }

                            { nextQuestions &&  anketaFromDb && 
                                anketaFromDb.map((data, index) => {
                                    if (index>=2) {
                                        return <QuestionnaireLine massiv={idNotPassed} data={data} key={index}/>
                                    }
                                })
                            }
                        </div>

                        {!nextQuestions && 
                            <div className="btn-submit">
                                <button
                                    onClick={onClickNext}
                                >
                                    Далее
                                </button>
                            </div>
                        }

                        {nextQuestions && 
                            <div className="btn-submit">
                                <button
                                    onClick={onClickSubmit}
                                >
                                    Отправить
                                </button>
                            </div>
                        }
                    </>
                }

                { passed && 
                    <>
                        <p className="count-recommendation">Количество ваших баллов за пройденное тестирование: {count} </p>
                        <p className={(count<=13 && "green-recommendation") || "red-recommendation"}>{recomendation}</p>
                        <div className="btn-submit-get-recommendation">
                            <button
                                onClick={() => onClickTestAgain()}
                            >
                                Пройти ещё раз
                            </button>
                        </div>
                    </> 
                }
            </main>
            <Footer/>
        </>
    )
}