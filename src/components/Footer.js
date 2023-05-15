import { useContext } from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/auth.context'

export const Footer = () => {
    const {isAuthenticatedAdmin, isAuthenticatedDoctor, isAuthenticatedPatient, login, password, userId} = useContext(AuthContext)
    if (isAuthenticatedPatient) {
        return (
            <footer>
                <nav>
                    <button><Link to="/">Главная</Link></button>
                    <button><Link to={`/recomendations/${userId}`}>Рекомендации</Link></button>
                    <button><Link to={`/directions/${userId}`}>Направления</Link></button>
                    <button><Link to="/about">Справочная информация</Link></button>
                </nav>
            </footer>
        )
    }
    return (
        <footer>
            <nav>
                <button><Link to="/">Главная</Link></button>
                <button><Link to="/about">Справочная информация</Link></button>
            </nav>
        </footer>
    )
}
