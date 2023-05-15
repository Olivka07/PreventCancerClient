import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Message } from "../components/Message"
import { useMessage } from "../hooks/message.hook"
import { request } from "../request/request"

export const ListAnketsPage = () => {
    const {message, showMessage, hideMessage} = useMessage()
    const {id_patient} = useParams()
    const navigate = useNavigate()

    const [listAnkets, setListAnkets] = useState([])

    const ftchGetAnkets = async() => {
        try {
            const res = await request('/api/patient/ankets', 'POST', {id_patient:Number(id_patient)})
            if (res.ok) {
                setListAnkets(res.ankets)
            } else {
                showMessage(res.message)
            }
        } catch(e) {}
    }

    useEffect(() => {
        ftchGetAnkets()
    }, [])


    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])


    return (
        
        <>
            <Header/>
            <main className="main-content">
                {message && <Message message={message}/>}
                <p className="page-header">
                    Список анкет пациента
                </p>
                <button
                    className="btn-back"
                    onClick={e => navigate(-1)}
                    title="Назад"
                >
                    &#8617;
                </button>
                <div className="list-elements">
                    {listAnkets && listAnkets.map((anketa, index) => {
                        return (
                            <Link 
                                key={index} 
                                to={`/patients/list_ankets/${id_patient}/${anketa.date_complete}`}
                            >
                                <div className="list-element">
                                    {"Дата прохождения: "+anketa.date_complete}
                                </div>  
                            </Link>
                        )
                    })}
                    
                </div>
            </main>
            <Footer/>
        </>
    )
}