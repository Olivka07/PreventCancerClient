import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { Message } from "../../components/Message"
import { AuthContext } from "../../context/auth.context"
import { useMessage } from "../../hooks/message.hook"
import { request } from "../../request/request"

// Для справочной информации

export const PatientsDoctorPage = () => {

    const {userId} = useContext(AuthContext)
    const [patients, setPatients] = useState([])



    const {message, showMessage, hideMessage} = useMessage()
    const navigate = useNavigate()

    const ftchGetDocPatients = async() => {
        const res = await request('/api/doctor/patients', 'POST', {id_doctor: Number(userId)})
        if (res.ok) {
            console.log(res.pats)
            setPatients(res.pats)
        } else {
            showMessage(res.message)
        }
    }

    

    useEffect(() => {
        ftchGetDocPatients()
    }, [])



    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    const printInfoAboutPatient = (patient) => {
        const htmlAboutPatient = `
            <html>
                <p>
                    ФИО: ${patient.surname + ' ' + patient.name + ' ' + patient.patronymic}
                </p>
                <p>
                    Пол: ${patient.sex}
                </p>
                <p>
                    Дата рождения: ${patient.birthdate.slice(0,10)}
                </p>
                <p>
                    Полных лет: ${agePatient(patient.birthdate.slice(0,10))}
                </p>
                <p>
                    Адрес: ${patient.address}
                </p>
                <p>
                    Полис: ${patient.polis}
                </p>
                <p>
                    СНИЛС: ${patient.snils}
                </p>
                <p>
                    Телефон: ${patient.phone}
                </p>
                <p>
                    Email: ${patient.email}
                </p>
            </html>
        `
        document.body.innerHTML = htmlAboutPatient
        window.print()
        window.location.reload()
    }

    const agePatient = (birthdate) => {
        const strDate = new Date().toLocaleDateString()
        const date = String(strDate).split('.')
        const bDate = String(birthdate).split('-')
        let age = Number(date[2]) - Number(bDate[0])
        if (Number(date[1])<Number(bDate[1])) {
            return age-1
        }
        if (Number(date[1])>Number(bDate[1])) {
            return age
        }
        if (Number(date[0])>=Number(bDate[2])) {
            return age
        }
        return age-1
    }

   

   
    return (
        <>
            <Header/>
            <main className="main-content">
                {message && <Message message={message}/>}
                <p className="page-header">
                    Список Ваших пациентов
                </p>
                <button
                    className="btn-back"
                    onClick={e => navigate(-1)}
                    title="Назад"
                >
                    &#8617;
                </button>
                <div className='div-table'>
                    {(!patients || patients.length === 0) && 
                        <p className="alert-void">
                            СПИСОК ПУСТ
                        </p>
                    }
                    {patients && patients.length >0 &&
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Фамилия</th>
                                <th>Имя</th>
                                <th>Отчество</th>
                                <th>Дата рождения</th>
                                <th>Пол</th>
                                <th>СНИЛС</th>
                                <th>Телефон</th>
                                <th>Адрес</th>
                                <th>Полис</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.surname}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.name}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.patronymic}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.birthdate.slice(0,10)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.sex}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.snils}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.phone}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.address}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                value={patient.polis}
                                                disabled={true}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                value={patient.email}
                                                disabled={true}
                                            />
                                        </td>

                                        <td>
                                            <Link to={`/patients/list_recomendations/${patient.id_patient}`}><button>Рекомендации</button></Link>
                                        </td>

                                        <td>
                                            <Link to={`/patients/list_directions/${patient.id_patient}`}><button>Направления</button></Link>
                                        </td>

                                        <td>
                                            <Link to={`/patients/list_ankets/${patient.id_patient}`}><button>Анкеты</button></Link>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={e =>printInfoAboutPatient(patient)}
                                                className="btn-print"
                                                title="Печать"
                                            >
                                                &#128196;
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table> }
                </div>
            </main>
            <Footer/>
        </>
    )
}