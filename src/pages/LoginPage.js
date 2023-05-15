import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/auth.context"

export const LoginPage = () => {

    const {loginHandler} = useContext(AuthContext)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const handlerLogin = (event) => {
        setLogin(event.target.value)
    }

    const handlerPassword = (event) => {
        setPassword(event.target.value)
    }

    const btnLogin = () => {
        loginHandler(login, password)
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

    return (
        <div className="inputForm">
            <p>Вход</p>

            <div className="element-of-form">
                <label htmlFor="login">Логин:</label>
                <input
                    value={login} 
                    onChange={handlerLogin}  
                    name="login" 
                    id="login" 
                    type="login" 
                    placeholder="Введите логин"
                />
            </div>


            <div className="element-of-form">
                <label htmlFor="password">Пароль:</label>
                <input
                    value={password} 
                    onChange={handlerPassword}  
                    name="password" 
                    id="password" 
                    type="password" 
                    placeholder="Введите пароль"
                />
                <input 
                    id="btn_show_hide" 
                    type="button" 
                    value="Показать пароль" 
                    onClick={e => clickShowHidePassword()}
                />
            </div>

            <button
                onClick={btnLogin}
            >
                Войти
            </button>
            
            <Link to="/"><button>Назад</button></Link>

            
        </div>
    )
}