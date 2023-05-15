import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Message } from "../components/Message"
import { useMessage } from "../hooks/message.hook"
import { request } from "../request/request"

export const AnketaPatientPage = () => {
    const {message, showMessage, hideMessage} = useMessage()
    const {id_patient, date_complete} = useParams()
    const navigate = useNavigate()

    const [anketa, setAnketa] = useState([])

    const ftchAnketaPatient = async() => {
        try {
            const res = await request('/api/patient/anketa', 'POST', {id_patient, date_complete})
            if (res.ok) {
                console.log(res.anketa)
                setAnketa(res.anketa)
            } else {
                showMessage(res.message)
            }
        } catch (e) {}
    }

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    useEffect(() => {
        ftchAnketaPatient()
    }, [])

    function printAnketa() {
        console.log(anketa)
        let textAnketa = ''
        anketa.forEach((el) => {
            textAnketa += el.text_question + ": " + el.text_answer + "<br/>"
        })
        const htmlAboutPatient = `
            <html>
                <p class="page-header">
                    Анкета пациента
                </p>
                <p>
                    ${textAnketa}
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
            <main className="main-content">
                {message && <Message message={message}/>}
                <p className="page-header">
                    Анкета пациента
                </p>
                <button
                    className="btn-back"
                    onClick={e => navigate(-1)}
                    title="Назад"
                >
                    &#8617;
                </button>
                <button
                    onClick={e =>printAnketa()}
                    className="btn-print-anketa"
                    title="Печать"
                >
                    &#128196;
                </button> 
                <div className="list-elements-anketa">
                    {anketa && anketa.map((question, index) => {
                        return (
                            <div key={index} className="list-element-anketa">
                                <span>{question.text_question + ": "}</span>
                                <span className="bold-answer">{question.text_answer}</span>
                            </div>
                        )
                    })}
                    
                </div>
            </main>
            <Footer/>
        </>
    )
}