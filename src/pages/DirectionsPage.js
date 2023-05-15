import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Message } from "../components/Message"
import { AuthContext } from "../context/auth.context"
import { useMessage } from "../hooks/message.hook"
import { request } from "../request/request"

export const DirectionsPage = () => {
    const {message, showMessage, hideMessage} = useMessage()
    const {id_patient} = useParams()
    const navigate = useNavigate()
    const {isAuthenticatedDoctor, isAuthenticatedPatient} = useContext(AuthContext)

    const [listDirections, setListDirections] = useState([])
    const [listDirectionsFromDB, setListDirectionsFromDB] = useState([])

    const [modal, setModal] = useState(false)
    const [modalId, setModalId] = useState(null)
    const [modalTextDirection, setModalTextDirection] = useState("")

    const ftchGetListDirections = async() => {
        try {
            const res = await request('/api/patient/directions', 'POST', {id_patient: Number(id_patient)})
            if (res.ok) {
                setListDirectionsFromDB([...res.dirs])
            } else {
                showMessage(res.message)
            }
        } catch(e) {}
    }

    const ftchNewDirection = async() => {
        try {
            const res = await request('/api/patient/direction', 'POST', {
                text_direction: modalTextDirection, id_patient: Number(id_patient)
            })
            showMessage(res.message)
            if (res.ok) {
                ftchGetListDirections()
            }
        } catch(e) {}
    }

    const ftchUpdateDirection = async() => {
        try {
            const res = await request('/api/patient/direction', 'PUT', {
                text_direction: modalTextDirection, id_direction: modalId,
                id_patient: Number(id_patient)
            })
            showMessage(res.message)
            if (res.ok) {
                ftchGetListDirections()
            }
        } catch(e) {}
    }

    const ftchDeleteDirection = async(id_direction) => {
        try {
            const res = await request('/api/patient/direction', 'DELETE', {
                id_direction: id_direction
            })
            showMessage(res.message)
            if (res.ok) {
                ftchGetListDirections()
            }
        } catch(e) {}
    }

    useEffect(() => {
        ftchGetListDirections()
    }, [])

    useEffect(() => {
        setListDirections(listDirectionsFromDB.map((el) => {
            const newEl = {...el}
            return newEl
        }))
    }, [listDirectionsFromDB])

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    const clickDirection = (direction=null) => {
        if (direction) {
            setModalTextDirection(direction.text_direction)
            setModalId(direction.id_direction)
        }
        setModal(true)
    }

    const saveDirection = () => {
        if (!modalId) {
            // Создание новой рекомендации
            ftchNewDirection()
        } else {
            // Редактирование имеющейся
            ftchUpdateDirection()
        }
        cancelDirection()
    }

    const deleteDirection = (id_direction) => {
        ftchDeleteDirection(id_direction)
    }

    const cancelDirection = () => {
        setModalId(null)
        setModal(false)
        setModalTextDirection("")
    }

    const printDirection = (direction) => {
        const htmlAboutPatient = `
            <html>
                <p class="page-header">
                    Направление
                </p>
                <p>
                    ${direction}
                </p>
            </html>
        `
        document.body.innerHTML = htmlAboutPatient
        window.print()
        window.location.reload()
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
                                value={modalTextDirection}
                                disabled={isAuthenticatedPatient}
                                onChange={e => setModalTextDirection(e.target.value)}
                            />
                            <div
                                className="flexing"
                            >
                                {isAuthenticatedDoctor && 
                                    <>
                                        <button 
                                            className="btn-two"
                                            onClick={e => saveDirection()}
                                        >
                                            СОХРАНИТЬ
                                        </button>
                                        <button 
                                            className="btn-two"
                                            onClick={e => cancelDirection()}
                                        >
                                            ОТМЕНА
                                        </button>
                                    </>   
                                }

                                {!isAuthenticatedDoctor &&
                                    <button 
                                        className="btn-two"
                                        onClick={e => cancelDirection()}
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
                    Направления
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
                            onClick={clickDirection}
                        >
                            Добавить
                        </button>
                    }
                    {listDirections && listDirections.map((direction, index) => {
                        return (
                            <div 
                                key={index} 
                                className="list-element-text"
                                title={direction.text_direction}
                            >
                                <div className="flexing">
                                    <span
                                        className="span-in-list-text"
                                        onClick={() => {
                                            clickDirection(direction)
                                        }}
                                    >
                                        {direction.text_direction}
                                    </span>
                                    {isAuthenticatedDoctor &&
                                    <>
                                        <button
                                            onClick={e =>printDirection(direction.text_direction)}
                                            className="btn-delete-text"
                                            title="Печать"
                                        >
                                            &#128196;
                                        </button> 
                                        <button 
                                            className="btn-delete-text"
                                            onClick={e => deleteDirection(direction.id_direction)}
                                            title="Удалить"
                                        >
                                            &#10060;
                                        </button>
                                        </>
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