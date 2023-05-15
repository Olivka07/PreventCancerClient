import React from "react"
import {Header} from '../../components/Header'
import {Footer} from '../../components/Footer'
import { Link } from "react-router-dom"

// Для авторизованных пользователей

export const AdminPage = () => {
    return (
        <>
            <Header/>
            <main>
                <div className="adminContent">
                    <Link to='/patients'><button>Пациенты</button></Link>
                    <Link to='/doctors'><button>Врачи</button></Link>
                    <Link to="/dicts"><button>Справочники</button></Link>
                    <Link to="/original-questionnaire"><button>Исходная анкета</button></Link>
                </div>
            </main>
            <Footer/>
        </>
    )
}