import {Header} from '../../components/Header'
import {Footer} from '../../components/Footer'
import { useContext, useEffect, useState } from 'react'
import { request } from '../../request/request'
import { useMessage } from '../../hooks/message.hook'
import { Message } from '../../components/Message'
import { AuthContext } from '../../context/auth.context'
import { Link } from 'react-router-dom'

export const DoctorsPage = () => {
    const {message, showMessage, hideMessage} = useMessage()
    const [clickRegsiter, setClickRegister] = useState(false)
    const {registerHandler} = useContext(AuthContext)

    const [dictJobDb, setDictJobDb] = useState([])
    const [dictDepDb, setDictDepDb] = useState([])

    const [doctorsDb, setDoctorsDb] = useState([]) // врачи из БД
    const [listDoctors, setListDoctors] = useState([]) // врачи на сайте


    const [surname, setSurname] = useState('')
    const [name, setName] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [dep, setDep] = useState(0)
    const [job, setJob] = useState(0)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')



    const ftchDictDep = async() => {
        const res = await request('/api/dicts/dep')
        if (res.ok) {
            setDictDepDb(res.dictDeps)
        } else {
            showMessage(res.message)
        }
    }

    const ftchDictJob = async() => {
        const res = await request('/api/dicts/job')
        if (res.ok) {
            setDictJobDb(res.dictJobs)
        } else {
            showMessage(res.message)
        }
    }

    const ftchDocs = async() => {
        const res = await request('/api/doctor/doctors')
        if (res.ok) {
            setDoctorsDb([...res.docs])
        } else {
            showMessage(res.message)
        }
    }

    const ftchPostDocs = async(updateDoctors, deleteDoctors) => {
        const res = await request('/api/doctor/doctors', 'POST', {updateDoctors, deleteDoctors})
        if (res.ok) {
            const res2 = await request('/api/doctor/doctors')
            if (res2.ok) {
                setDoctorsDb([...res2.docs])
            } else {
                showMessage(res2.message)
            }
        } else {
            showMessage(res.message)
        }
    }

    useEffect(() => {
        if (doctorsDb.length) {
            let ved = doctorsDb.map((el) => {
                const newEl = {...el}
                return newEl
            })
            setListDoctors(ved)
        }
    }, [doctorsDb])




    useEffect(() => {
        setClickRegister(false)
        ftchDocs()
        ftchDictDep()
        ftchDictJob()
    }, [])

    // useEffect(() => {
    //     console.log('doctorsDb from useEff', doctorsDb)
    //     setListDoctors([...doctorsDb])
    // }, [doctorsDb])

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    const clickAddDoctor = () => {
        const updateDoctors = []
        const deleteDoctors = []
        listDoctors.forEach((el) => {
            const doc = doctorsDb.find((elem) => {
                if (elem.id_doctor===el.id_doctor) {
                    return elem
                }
            })
            if (el.id_department !== doc.id_department || el.id_job !== doc.id_job || el.surname !== doc.surname ||
            el.name !== doc.name || el.patronymic !== doc.patronymic) {
                updateDoctors.push(el)
            }
        })

        doctorsDb.forEach((el) => {
            const doc = listDoctors.find((elem) => {
                if (elem.id_doctor===el.id_doctor) {
                    return elem
                }
            })
            if (!doc) {
                deleteDoctors.push(el.id_doctor)
            }
        })

        if (deleteDoctors.length > 0 || updateDoctors.length > 0) {
            const key = window.confirm("У вас есть несохранённые данные. Если вы продолжите, то изменения пропадут. \n\nПродолжить?")
            if (key) {
                setClickRegister(true)
            }
        } else {
            setClickRegister(true)
        }
    }

    

    const handlerSurname = (event) => {
        setSurname(event.target.value)
    }

    const handlerName = (event) => {
        setName(event.target.value)
    }

    const handlerPatronymic = (event) => {
        setPatronymic(event.target.value)
    }

    const handlerLogin = (event) => {
        setLogin(event.target.value)
    }

    const handlerPassword = (event) => {
        setPassword(event.target.value)
    }

    const btnRegister = () => {
        const newDoctor = {
            surname, 
            name, 
            patronymic, 
            dep,
            job,
            login, 
            password
        }
        new Promise((resolve, revoke) => {
            resolve(registerHandler(newDoctor, 'doctor'))
        }).then((key) => {
            if (key === true) {
                setSurname('')
                setName('')
                setPassword('')
                setPatronymic('')
                setLogin('')
                setDep(0)
                setJob(0)
            }
        })
        
    }

    const cancelReg = () => {
        setSurname('')
        setName('')
        setPassword('')
        setPatronymic('')
        setLogin('')
        setDep(0)
        setJob(0)
        ftchDocs()
        setClickRegister(false)
    }

    const changeSurnameHandler = (event, elem) => {
        setListDoctors(listDoctors.map((el) => {
            if (el.id_doctor === elem.id_doctor) {
                el.surname = event.target.value
            }
            return el
        }))
    }

    const clickSave = () => {
        const updateDoctors = []
        const deleteDoctors = []
        listDoctors.forEach((el) => {
            const doc = doctorsDb.find((elem) => {
                if (elem.id_doctor===el.id_doctor) {
                    return elem
                }
            })
            if (el.id_department !== doc.id_department || el.id_job !== doc.id_job || el.surname !== doc.surname ||
                el.name !== doc.name || el.patronymic !== doc.patronymic) {
                    updateDoctors.push(el)
            }  
        })

        doctorsDb.forEach((el) => {
            const doc = listDoctors.find((elem) => {
                if (elem.id_doctor===el.id_doctor) {
                    return elem
                }
            })
            if (!doc) {
                deleteDoctors.push(el.id_doctor)
            }
        })
        
        ftchPostDocs(updateDoctors, deleteDoctors)

    }

    const clickDeleteDocHandler = (doc) => {
        setListDoctors(listDoctors.filter((el) => {
            if (el.id_doctor!==doc.id_doctor) {
                return el
            }
        }))
    }

    function clickShowHidePassword() {
        const input = document.getElementById('password')
        const button = document.getElementById('btn_show_hide')
        if (input.type==="password") {
            input.type = "text"
            button.value="Скрыть пароль"
        } else {
            input.type = "password"
            button.value='Показать пароль'
        }
    }


    

    if (!clickRegsiter) {
        return (
            <>
                <Header/>
                <main className="main-content">
                    <p className="page-header">
                        Список врачей
                    </p>
                    <div className='div-table'>
                        <div className='just-content'>
                            <button className="button-add-in-table" onClick={clickAddDoctor}>Добавить</button>
                            <button className="button-add-in-table" onClick={clickSave}>&#128190;</button>
                        </div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Фамилия</th>
                                    <th>Имя</th>
                                    <th>Отчество</th>
                                    <th>Должность</th>
                                    <th>Отделение</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listDoctors && listDoctors.map((doctor, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    value={doctor.surname}
                                                    onChange={e => changeSurnameHandler(e, doctor)}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    value={doctor.name}
                                                    onChange={e => setListDoctors(
                                                        listDoctors.map((el) => {
                                                            if (el.id_doctor === doctor.id_doctor) {
                                                                el.name = e.target.value
                                                            }
                                                            return el
                                                        })
                                                    )}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    value={doctor.patronymic}
                                                    onChange={e => setListDoctors(
                                                        listDoctors.map((el) => {
                                                            if (el.id_doctor === doctor.id_doctor) {
                                                                el.patronymic = e.target.value
                                                            }
                                                            return el
                                                        })
                                                    )}
                                                />
                                            </td>

                                            <td>
                                                <select
                                                    name='job'
                                                    id='job'
                                                    value={doctor.id_job}
                                                    onChange={e => setListDoctors(
                                                        listDoctors.map((el) => {
                                                            if (el.id_doctor === doctor.id_doctor) {
                                                                el.id_job = Number(e.target.value)
                                                            }
                                                            return el
                                                        })
                                                    )}
                                                >
                                                    <option
                                                        value={0}
                                                    >
                                                        ...
                                                    </option>
                                                    {dictJobDb && dictJobDb.map((el,index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={el.id_job}
                                                            >
                                                                {el.name}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </td>

                                            <td>
                                                <select
                                                    name='dep'
                                                    id='dep'
                                                    value={doctor.id_department}
                                                    onChange={e => setListDoctors(
                                                        listDoctors.map((el) => {
                                                            if (el.id_doctor === doctor.id_doctor) {
                                                                el.id_department = Number(e.target.value)
                                                            }
                                                            return el
                                                        })
                                                    )}
                                                >
                                                    <option
                                                        value={0}
                                                    >
                                                        ...
                                                    </option>
                                                    {dictDepDb && dictDepDb.map((el, index) => {
                                                        return (
                                                            <option
                                                                value={el.id_department}
                                                                key={index}
                                                            >
                                                                {el.name}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </td>
                                            <td>
                                                <Link to={`/patients/${doctor.id_doctor}`}><button>Пациенты</button></Link>
                                            </td>
                                            <td>
                                                <button onClick={e =>clickDeleteDocHandler(doctor)}>&#10060;</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </main>
                <Footer/>
            </>
        )
    } 

    return (
        <>
            <Header/>
            <main className="main-content">
                {message && <Message message={message}/>}
                <div className="inputForm">
                    <p>Регистрация врача</p>

                    <div className="element-of-form">
                        <label htmlFor="surname">Фамилия</label>
                        <input
                            value={surname} 
                            onChange={handlerSurname}  
                            name="surname" 
                            id="surname" 
                            type="text" 
                            placeholder="Введите фамилию"
                            required
                        />
                    </div>

                    <div className="element-of-form">
                        <label htmlFor="name">Имя</label>
                        <input
                            value={name} 
                            onChange={handlerName}  
                            name="name" 
                            id="name" 
                            type="text" 
                            placeholder="Введите имя"
                            required
                        />
                    </div>

                    <div className="element-of-form">
                        <label htmlFor="patronymic">Отчество</label>
                        <input
                            value={patronymic} 
                            onChange={handlerPatronymic}  
                            name="patronymic" 
                            id="patronymic" 
                            type="text" 
                            placeholder="Введите отчество"
                            required
                        />
                    </div>


                    <div className="element-of-form">
                        <label htmlFor="dep">Отделение</label>
                        <select
                            name='dep'
                            id='dep'
                            value={dep}
                            onChange={e => {setDep(Number(e.target.value))}}
                        >
                            <option
                                value={0}
                            >
                                ...
                            </option>
                            {dictDepDb && dictDepDb.map((el, index) => {
                                return (
                                    <option
                                        value={el.id_department}
                                        key={index}
                                    >
                                        {el.name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="element-of-form">
                        <label htmlFor="job">Должность</label>
                        <select
                            name='job'
                            id='job'
                            value={job}
                            onChange={e => {setJob(Number(e.target.value))}}
                        >
                            <option
                                value={0}
                            >
                                ...
                            </option>
                            {dictJobDb && dictJobDb.map((el,index) => {
                                return (
                                    <option
                                        key={index}
                                        value={el.id_job}
                                    >
                                        {el.name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="element-of-form">
                        <label htmlFor="login">Логин</label>
                        <input
                            value={login} 
                            onChange={handlerLogin}  
                            name="login" 
                            id="login" 
                            type="login" 
                            placeholder="Введите login"
                            required
                        />
                    </div>

                    <div className="element-of-form">
                        <label htmlFor="password">Пароль</label>
                        <input
                            value={password} 
                            onChange={handlerPassword}  
                            name="password" 
                            id="password" 
                            type="password" 
                            placeholder="Введите пароль"
                            required
                        />
                        <input 
                            id="btn_show_hide" 
                            type="button" 
                            value="Показать пароль" 
                            onClick={e => clickShowHidePassword()}
                        />
                    </div>

                    <button
                        onClick={btnRegister}
                    >
                        Зарегистрировать
                    </button>
                    <button onClick={e => {cancelReg()}}>Назад</button>
                </div>
            </main>
            <Footer/>
        </>
    )

    
}