import React, { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { Message } from "../../components/Message"
import { useMessage } from "../../hooks/message.hook"
import { request } from "../../request/request"

// Для справочной информации

export const PatientsPage = () => {
    const [selectList, setSelectList] = useState([])
    const [patientsDb, setPatientsDb] = useState([])
    const [patients, setPatients] = useState([])

    const [selValue, setSelValue] = useState(0)

    const {id} = useParams()
    const {message, showMessage, hideMessage} = useMessage()
    const navigate = useNavigate()

    const ftchGetDocPatients = async() => {
        const res = await request('/api/doctor/patients', 'POST', {id_doctor: Number(id)})
        if (res.ok) {
            console.log(res.pats)
            setPatientsDb(res.pats)
        } else {
            showMessage(res.message)
        }
    }

    const ftchGetPatients = async() => {
        const res = await request('/api/doctor/patients')
        if (res.ok) {
            setSelectList(res.pats)
        } else {
            showMessage(res.message)
        }
    }

    const ftchPostPatients = async(updatePatients, deletePatients) => {
        const res = await request('/api/doctor/updpatients', 'POST', {updatePatients, deletePatients})
        if (res.ok) {
            console.log(res)
            ftchGetDocPatients()
            ftchGetPatients()
        } else {
            showMessage(res.message)
        }
    }

    useEffect(() => {
        ftchGetDocPatients()
        ftchGetPatients()
    }, [])

    useEffect(() => {
        if (patientsDb.length) {
            let ved = patientsDb.map((el) => {
                const newEl = {...el}
                return newEl
            })
            setPatients(ved)
        }
    }, [patientsDb])

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    const clickAddPatient = () => {
        const patient = selectList.find((pat) => {
            if (pat.id_patient === Number(selValue)) {
                return pat
            }
        })
        if (patient) {
            setSelValue(0)
            setSelectList(selectList.filter((el) => {
                if (el.id_patient !== patient.id_patient) {
                    return el
                }
            }))
            setPatients([...patients, {...patient, id_doctor:Number(id)}])
        }
    }

    const clickSave = () => {
        const updatePatients = []
        const deletePatients = []
        patients.forEach((el) => {
            const pat = patientsDb.find((elem) => {
                if (elem.id_doctor===el.id_doctor) {
                    return elem
                }
            })
            if (pat) {
                if (pat.birthdate.slice(0,10) !== el.birthdate.slice(0,10) || el.surname !== pat.surname ||
                    el.name !== pat.name || el.patronymic !== pat.patronymic || 
                    el.sex !== pat.sex || el.snils !== pat.snils || el.phone !== pat.phone || el.address !== pat.address
                    || el.polis !== pat.polis || el.email !== pat.email ) {
                        updatePatients.push(el)
                }  
            } else {
                updatePatients.push(el)
            }
            
        })

        patientsDb.forEach((el) => {
            const pat = patients.find((elem) => {
                if (elem.id_patient===el.id_patient) {
                    return elem
                }
            })
            if (!pat) {
                deletePatients.push(el.id_patient)
            }
        })
        
        ftchPostPatients(updatePatients, deletePatients)
    }

    const clickDeletePatientHandler = (pat) => {
        setPatients(patients.filter((el) => {
            if (el.id_patient!==pat.id_patient) {
                return el
            }
        }))
        setSelectList([...selectList, {...pat, id_doctor:null}])
    }
    return (
        <>
            <Header/>
            <main className="main-content">
                {message && <Message message={message}/>}
                <p className="page-header">
                    Список пациентов врача
                </p>
                <button
                    className="btn-back"
                    onClick={e => navigate(-1)}
                >
                    &#8617;
                </button>
                <div className='div-table'>
                    <div className='just-content'>
                        <button className="button-add-in-table" onClick={clickAddPatient}>Добавить</button>
                        <select
                            className="select-patients"
                            value={selValue}
                            onChange={e => setSelValue(e.target.value)}
                        >
                            <option value={0}>...</option>
                            {selectList && selectList.map((pat, index) => {
                                return (
                                    <option
                                        value={pat.id_patient}
                                        key={index}
                                    >
                                        {pat.surname + " " + pat.name + " " + pat.patronymic}
                                    </option>
                                )
                            })}
                        </select>
                        <button className="button-add-in-table" onClick={clickSave}>&#128190;</button>
                    </div>
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
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.surname = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.name}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.name = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.patronymic}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.patronymic = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.birthdate.slice(0,10)}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.birthdate = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.sex}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.sex = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.snils}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.snils = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.phone}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.phone = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.address}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.address = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.polis}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.polis = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                disabled={true}
                                                value={patient.email}
                                                onChange={e => setPatients(
                                                    patients.map((el) => {
                                                        if (el.id_patient === patient.id_patient) {
                                                            el.email = e.target.value
                                                        }
                                                        return el
                                                    })
                                                )}
                                            />
                                        </td>

                                        
                                        <td>
                                            <Link to={`/patients/list_ankets/${patient.id_patient}`}><button>Анкеты</button></Link>
                                        </td>
                                        <td>
                                            <button onClick={e =>clickDeletePatientHandler(patient)}>&#10060;</button>
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