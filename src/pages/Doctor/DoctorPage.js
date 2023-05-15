import React from "react"
import { Link } from "react-router-dom"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"

// Для докторов

export const DoctorPage = () => {
    return (
        <>
            <Header/>
            <main>
                <div className="doctorContent">
                    <Link to='/patients'><button>Пациенты</button></Link>
                    <Link to='/statistics'><button>Статистика</button></Link>
                </div>
            </main>
            <Footer/>
        </>
    )
}