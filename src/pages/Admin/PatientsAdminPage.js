import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { request } from "../../request/request"

export const PatientsAdminPage = () => {
    const [listNotConfirm, setListNotConfirm] = useState([])
    const [listNotConfirmFromDb, setListNotConfirmFromDb] = useState([])
    const [hideModal,setHideModal] = useState(false)

    const [patients, setPatients] = useState([])
    const [patientsFromDb, setPatientsFromDb] = useState([])

    const ftchGetListNotConfirmFromDb = async() => {
        try {
            const res = await request('/api/patient/notconfirm')
            if (res.ok) {
                setListNotConfirmFromDb(res.pats)
                setListNotConfirm(res.pats.map((el) => {
                    return {...el}
                }))
            }
        } catch(e) {}
    }

    const ftchSetListNotConfirmInDb = async() => {
        try {
            const deletePatients = []
            const updatePatients = []
            listNotConfirmFromDb.forEach((el) => {
                if (el.delete) {
                    deletePatients.push(el.id_patient)
                } else if (el.confirm === true){
                    updatePatients.push(el.id_patient)
                }
            })
            const res = await request('/api/patient/notconfirm', 'POST', {updatePatients, deletePatients})
            if (res.ok) {
                // ----- message
            }
        } catch(e) {}
    }

    const ftchGetPatients = async() => {
        try {
            const res = await request('/api/patient/all')
            if (res.ok) {
                setPatients(res.pats.map((el) => {
                    return {...el}
                }))
                setPatientsFromDb(res.pats)
            } else {
                // ----- message
            }
        } catch(e) {}
    }

    const ftchSetPatients = async(deletePatients) => {
        try {
            const res = await request('/api/patient/all', 'POST', {deletePatients})
            if (res.ok) {
                ftchGetPatients()
            } else {
                // ----- message
            }
        } catch(e) {}
    }


    useEffect(() => {
        ftchGetListNotConfirmFromDb()
        ftchGetPatients()
    }, [])

    const clickConfirmOk = async() => {
        await ftchSetListNotConfirmInDb()
        setHideModal(true)
        ftchGetPatients()
    }

    const clickDeletePatientHandler = (patient) => {
        setListNotConfirm(
            listNotConfirm.filter((el) => {
                if (el.id_patient !== patient.id_patient) {
                    return el
                }
            })
        )
        
        setListNotConfirmFromDb(
            listNotConfirmFromDb.map((el)=>{
                if (el.id_patient === patient.id_patient) {
                    el.delete = true
                }
                return el
            })
        )
    }

    const clickConfirmPatientHandler = (patient) => {
        setListNotConfirm(
            listNotConfirm.filter((el) => {
                if (el.id_patient !== patient.id_patient) {
                    return el
                }
            })
        )
        setListNotConfirmFromDb(
            listNotConfirmFromDb.map((el)=>{
                if (el.id_patient === patient.id_patient) {
                    el.confirm = true
                }
                return el
            })
        )
    }

    const clickDeletePatient = (patient) => {
        setPatients(patients.filter((el) => {
            if (el.id_patient!==patient.id_patient) {
                return el
            }
        }))
    }

    const clickSave = () => {
        const deletePatients = []
        patientsFromDb.forEach((pat) => {
            if (!patients.find((el) => {
                if (el.id_patient === pat.id_patient) {
                    return el
                }
            })) {
                deletePatients.push(pat.id_patient)
            }
        })
        ftchSetPatients(deletePatients)
    }

    return (
        <>
            <Header/>
            { listNotConfirmFromDb.length>0 && !hideModal && 
                <div className="modal">
                    <div className="content-modal">
                        <p className="page-header">
                            Неподтверждённые пациенты
                        </p>
                        {listNotConfirm.length>0 && 
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
                                    {listNotConfirm.map((patient, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        disabled={true}
                                                        value={patient.surname}
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
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
                                                        onChange={e => setListNotConfirm(
                                                            listNotConfirm.map((el) => {
                                                                if (el.id_patient === patient.id_patient) {
                                                                    el.email = e.target.value
                                                                }
                                                                return el
                                                            })
                                                        )}
                                                    />
                                                </td>

                                                
                                                <td>
                                                    <button onClick={e =>clickConfirmPatientHandler(patient)}>&#9989;</button>
                                                </td>
                                                <td>
                                                    <button onClick={e =>clickDeletePatientHandler(patient)}>&#10060;</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        }
                         
                        <button
                            onClick={clickConfirmOk}
                            className="btn-center"
                        >
                            ОК
                        </button>
                    </div>
                </div>
            }
            <main className="main-content">
                <p className="page-header">
                    Пациенты
                </p>
                <div className="div-table">
                    <div className='just-content'>
                        <button className="button-add-in-table" onClick={clickSave}>&#128190;</button>
                    </div>
                    {(!patients || patients.length === 0) && 
                        <p className="alert-void">
                            СПИСОК ПУСТ
                        </p>
                    }
                    {patients && patients.length>0 && 
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Фамилия</th>
                                    <th>Имя</th>
                                    <th>Отчество</th>
                                    <th>Врач</th>
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
                                {patients && patients.map((patient, index) => {
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
                                                    value={patient.doctor}
                                                    onChange={e => setPatients(
                                                        patients.map((el) => {
                                                            if (el.id_patient === patient.id_patient) {
                                                                el.doctor = e.target.value
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
                                                <button onClick={e =>clickDeletePatient(patient)}>&#10060;</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                    
                </div>
                
            </main>
            <Footer/>
        </>
    )
}