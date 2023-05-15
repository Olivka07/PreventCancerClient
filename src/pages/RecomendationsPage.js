import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Message } from "../components/Message"
import { AuthContext } from "../context/auth.context"
import { useMessage } from "../hooks/message.hook"
import { request } from "../request/request"

export const RecomendationsPage = () => {
    const {message, showMessage, hideMessage} = useMessage()
    const {id_patient} = useParams()
    const navigate = useNavigate()
    const {isAuthenticatedDoctor, isAuthenticatedPatient} = useContext(AuthContext)

    const [listRecomendations, setListRecomendations] = useState([])
    const [listRecomendationsFromDB, setListRecomendationsFromDB] = useState([])

    const [modal, setModal] = useState(false)
    const [modalId, setModalId] = useState(null)
    const [modalTextRecomendation, setModalTextRecomendation] = useState("")

    const ftchGetListRecomendations = async() => {
        try {
            const res = await request('/api/patient/recomendations', 'POST', {id_patient: Number(id_patient)})
            if (res.ok) {
                setListRecomendationsFromDB([...res.recs])
            } else {
                showMessage(res.message)
            }
        } catch(e) {}
    }

    const ftchNewRecomendation = async() => {
        try {
            const res = await request('/api/patient/recomendation', 'POST', {
                text_recomendation: modalTextRecomendation, id_patient: Number(id_patient)
            })
            showMessage(res.message)
            if (res.ok) {
                ftchGetListRecomendations()
            }
        } catch(e) {}
    }

    const ftchUpdateRecomendation = async() => {
        try {
            const res = await request('/api/patient/recomendation', 'PUT', {
                text_recomendation: modalTextRecomendation, id_recomendation: modalId,
                id_patient: Number(id_patient)
            })
            showMessage(res.message)
            if (res.ok) {
                ftchGetListRecomendations()
            }
        } catch(e) {}
    }

    const ftchDeleteRecomendation = async(id_recomendation) => {
        try {
            const res = await request('/api/patient/recomendation', 'DELETE', {
                id_recomendation: id_recomendation
            })
            showMessage(res.message)
            if (res.ok) {
                ftchGetListRecomendations()
            }
        } catch(e) {}
    }

    useEffect(() => {
        ftchGetListRecomendations()
    }, [])

    useEffect(() => {
        setListRecomendations(listRecomendationsFromDB.map((el) => {
            const newEl = {...el}
            return newEl
        }))
    }, [listRecomendationsFromDB])

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    const clickRecomendation = (recomendation=null) => {
        if (recomendation) {
            setModalTextRecomendation(recomendation.text_recomendation)
            setModalId(recomendation.id_recomendation)
        }
        setModal(true)
    }

    const saveRecomendation = () => {
        if (!modalId) {
            // Создание новой рекомендации
            ftchNewRecomendation()
        } else {
            // Редактирование имеющейся
            ftchUpdateRecomendation()
        }
        cancelRecomendation()
    }

    const deleteRecomendation = (id_recomendation) => {
        ftchDeleteRecomendation(id_recomendation)
    }

    const cancelRecomendation = () => {
        setModalId(null)
        setModal(false)
        setModalTextRecomendation("")
    }

    return (
        <>
            <Header/>
            <main>
                {message && <Message message={message}/>}
                {modal && 
                    <>
                        <div className="modal-text-bg"></div>
                        <div className="modal-text-content">
                            <textarea
                                disabled={isAuthenticatedPatient}
                                value={modalTextRecomendation}
                                onChange={e => setModalTextRecomendation(e.target.value)}
                            />
                            <div
                                className="flexing"
                            >
                                {isAuthenticatedDoctor && 
                                    <>
                                        <button 
                                            className="btn-two"
                                            onClick={e => saveRecomendation()}
                                        >
                                            СОХРАНИТЬ
                                        </button>
                                        <button 
                                            className="btn-two"
                                            onClick={e => cancelRecomendation()}
                                        >
                                            ОТМЕНА
                                        </button>
                                    </>
                                }

                                {!isAuthenticatedDoctor && 
                                    <button 
                                        className="btn-two"
                                        onClick={e => cancelRecomendation()}
                                    >
                                        Назад
                                    </button>
                                }
                                
                            </div>
                        </div>
                    </>
                }
                <p
                    className="page-header"
                >
                    Рекомендации
                </p>
                <button
                    className="btn-back"
                    onClick={e => navigate(-1)}
                    title="Назад"
                >
                    &#8617;
                </button>
                <div className="list-elements-anketa">
                    {
                        isAuthenticatedDoctor && 
                        <button 
                            className="btn-add-text" 
                            onClick={clickRecomendation}
                        >
                            Добавить
                        </button>
                    }
                    {listRecomendations && listRecomendations.map((recomendation, index) => {
                        return (
                            <div 
                                key={index} 
                                className="list-element-text"
                                title={recomendation.text_recomendation}
                            >
                                <div className="flexing">
                                    <span
                                        className="span-in-list-text"
                                        onClick={() => {
                                            clickRecomendation(recomendation)
                                        }}
                                    >
                                        {recomendation.text_recomendation}
                                    </span>
                                    {isAuthenticatedDoctor && 
                                        <button 
                                            className="btn-delete-text"
                                            onClick={e => deleteRecomendation(recomendation.id_recomendation)}
                                        >
                                            &#10060;
                                        </button>
                                    }
                                </div>
                                
                            </div>
                        )
                    })}
                    
                </div>
            </main>
            <Footer/>
        </>
    )
}