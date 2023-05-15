import { useContext } from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/auth.context'

export const Header = () => {
    const {isAuthenticatedAdmin, isAuthenticatedDoctor, isAuthenticatedPatient, userId, logoutHandler} = useContext(AuthContext)
    if (isAuthenticatedPatient) {
        return (
            <header>
                <nav>
                    <button><Link to="/">Главная</Link></button>
                    <button><Link to={`/recomendations/${userId}`}>Рекомендации</Link></button>
                    <button><Link to={`/directions/${userId}`}>Направления</Link></button>
                    <button><Link to="/about">Справочная информация</Link></button>
                    <button onClick={ logoutHandler }><Link to="/">Выйти</Link></button>
                </nav>
            </header>
        )
    }
    if (isAuthenticatedDoctor) {
        return (
            <header>
                <nav>
                    <button><Link to="/">Главная</Link></button>
                    <button><Link to="/about">Справочная информация</Link></button>
                    <button onClick={ logoutHandler }><Link to="/">Выйти</Link></button>
                </nav>
            </header>
        )
    }
    if (isAuthenticatedAdmin) {
        return (
            <header>
                <nav>
                    <button><Link to="/">Главная</Link></button>
                    <button><Link to="/about">Справочная информация</Link></button>
                    <button onClick={ logoutHandler }><Link to="/">Выйти</Link></button>
                </nav>
            </header>
        )
    }
    return (
        <header>
            <nav>
                <button><Link to="/">Главная</Link></button>
                <button><Link to="/login">Войти</Link></button>
                <button><Link to="/registration">Зарегистрироваться</Link></button>
                <button><Link to="/about">Справочная информация</Link></button>
            </nav>
        </header>
    )
}
