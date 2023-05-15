import { useEffect, useState } from "react"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { Message } from "../../components/Message"
import { useMessage } from "../../hooks/message.hook"
import { request } from "../../request/request"

export const DictsPage = () => {
    const {message, showMessage, hideMessage} = useMessage()
    const [dictJobDb, setDictJobDb] = useState([])
    const [dictDepDb, setDictDepDb] = useState([])

    const [listDep, setListDep] = useState([])
    const [listJob, setListJob] = useState([])


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

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    useEffect(() => {
        ftchDictDep()
        ftchDictJob()
    }, [])

    useEffect(() => {
        setListDep([...dictDepDb])
    }, [dictDepDb])

    useEffect(() => {
        setListJob([...dictJobDb])
    }, [dictJobDb])

    const addInListDep = () => {
        setListDep([...listDep, {id_department: Number(new Date())+37, name: ''}])
    }

    const addInListJob = () => {
        setListJob([...listJob, {id_job: Number(new Date())+37, name: ''}])
    }

    const changeJobHandler = (event, elem) => {
        setListJob(listJob.map((el) => {
            if (el.id_job === elem.id_job) {
                el.name = event.target.value
            }
            return el
        }))
    }

    const changeDepartmentHandler = (event, elem) => {
        setListDep(listDep.map((el) => {
            if (el.id_department === elem.id_department) {
                el.name = event.target.value
            }
            return el
        }))
    }

    const saveListJob = async() => {
        let key = true
        for (let i = 0; i<listJob.length; i++) {
            if (listJob[i].name.trim() === '') {
                key = false
            }
        }
        let key1 = true
        for (let i = 0; i< listJob.length; i++) {
            const pretedent = listJob.find((el,index) => {
                if (String(el.name).toUpperCase() === listJob[i].name.toUpperCase() && index !== i) {
                    return el
                }
            })
            if (pretedent) {
                key1 = false
            }
        }
        if (!key) {
            showMessage("В списке должностей есть пустой элемент")
        } else if(!key1) {
            showMessage("В списке должностей есть повторяющийся элемент")
        } else {
            const updateJob = []
            const insertJob = []
            const deleteJob = []

            listJob.forEach((inlist) => {
                if (dictJobDb.find((inDb) => {
                    if (inDb.id_job === inlist.id_job) {
                        return inDb
                    }
                })) {
                    updateJob.push(inlist)
                } else {
                    insertJob.push(inlist)
                }
            })

            dictJobDb.forEach((inDb) => {
                if (!listJob.find((inlist) => {
                    if (inlist.id_job === inDb.id_job) {
                        return inlist
                    }
                })) {
                    deleteJob.push(inDb.id_job)
                }
            })
            const res = await request('/api/dicts/job', 'POST', {deleteJob, updateJob, insertJob})
            if (res.ok) {
                ftchDictJob()
            }
            showMessage(res.message)
        }
    }

    const saveListDep = async() => {

        let key = true
        for (let i = 0; i<listDep.length; i++) {
            if (listDep[i].name.trim() === '') {
                key = false
            }
        }
        let key1 = true
        for (let i = 0; i<listDep.length; i++) {
            const pretedent = listDep.find((el,index) => {
                if (String(el.name).toUpperCase() === listDep[i].name.toUpperCase() && index !== i) {
                    return el
                }
            })
            if (pretedent) {
                key1 = false
            }
        }
        if (!key) {
            showMessage("В списке отделений есть пустой элемент")
        } else if (!key1) {
            showMessage("В списке отделений есть повторяющийся элемент")
        } else {
            const updateDep = []
            const insertDep = []
            const deleteDep = []

            listDep.forEach((inlist) => {
                if (dictDepDb.find((inDb) => {
                    if (inDb.id_department === inlist.id_department) {
                        return inDb
                    }
                })) {
                    updateDep.push(inlist)
                } else {
                    insertDep.push(inlist)
                }
            })

            dictDepDb.forEach((inDb) => {
                if (!listDep.find((inlist) => {
                    if (inlist.id_department === inDb.id_department) {
                        return inlist
                    }
                })) {
                    deleteDep.push(inDb.id_department)
                }
            })
            const res = await request('/api/dicts/dep', 'POST', {deleteDep, updateDep, insertDep})
            if (res.ok) {
                ftchDictDep()
            }
            showMessage(res.message)
        }
    }

    const deleteFromDep = (elem) => {
        setListDep(listDep.filter((el) => {
            if (el.id_department !== elem.id_department) {
                return el
            }
        }))
    }

    const deleteFromJob = (elem) => {
        setListJob(listJob.filter((el) => {
            if (el.id_job !== elem.id_job) {
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
                    Справочники
                </p>
                <div className="flexing-dicts">
                    <div className="dict">
                        <span>Справочник должностей</span>
                        <div className="list-dict">
                            <div className="flexing">
                                <button className="button-add-in-list" onClick={addInListJob}>Добавить</button>
                                <button className="button-add-in-list" onClick={saveListJob}>&#128190;</button>
                            </div>
                            <div className="table-list">
                                {listJob && listJob.map((el) => {
                                    return (
                                        <div key={el.id_job} className="str-dict">
                                            <input
                                                name={el.name}
                                                value={el.name}
                                                onChange={e => changeJobHandler(e, el)}
                                            />
                                            <button onClick={e => deleteFromJob(el)}>✖</button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="dict">
                        <span>Справочник отделений</span>
                        <div className="list-dict">
                            <div className="flexing">
                                <button className="button-add-in-list" onClick={addInListDep}>Добавить</button>
                                <button className="button-add-in-list" onClick={saveListDep}>&#128190;</button>
                            </div>
                            <div className="table-list">
                                {listDep && listDep.map((el) => {
                                        return (
                                            <div key={el.id_department} className="str-dict">
                                                <input
                                                    name={el.name}
                                                    value={el.name}
                                                    onChange={e => changeDepartmentHandler(e, el)}
                                                />
                                                <button onClick={e => deleteFromDep(el)}>✖</button>
                                            </div>
                                        )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    )
}


