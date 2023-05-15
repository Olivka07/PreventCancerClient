import React, { useEffect } from "react"
import { useContext, useState } from "react"
import {AuthContext} from '../context/auth.context'
import {Link} from 'react-router-dom'

export const RegistrationPage = () => {
    const {registerHandler} = useContext(AuthContext)

    const [surname, setSurname] = useState('')
    const [name, setName] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [sex, setSex] = useState('')
    const [snils, setSnils] = useState('')
    const [selection, setSelection] = useState()
    const [selection1, setSelection1] = useState()
    const [phone, setPhone] = useState('+7(___)___-__-__')
    const [address, setAddress] = useState('')
    const [polis, setPolis] = useState('__ __ _______')
    const [email, setEmail] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')


    useEffect(() => {
        if (!selection) {
            return
        }
        switch(selection) {
            case 6: {
                setSelection(7)
                break;
            }
            case 10: {
                setSelection(11)
                break;
            }
            case 13: {
                setSelection(14)
                break;
            }
            default: {
                const input = document.getElementById('phone')
                input.focus()
                input.setSelectionRange(selection, selection)
            }
        }
    }, [selection])

    useEffect(() => {
        if (!selection1) {
            return
        }
        switch(selection1) {
            case 2: {
                setSelection1(3)
                break;
            }
            case 5: {
                setSelection1(6)
                break;
            }
            default: {
                const input = document.getElementById('polis')
                input.focus()
                input.setSelectionRange(selection1, selection1)
            }
        }
    }, [selection1])


    const handlerSurname = (event) => {
        setSurname(event.target.value)
    }

    const handlerName = (event) => {
        setName(event.target.value)
    }

    const handlerPatronymic = (event) => {
        setPatronymic(event.target.value)
    }

    const handlerSex = (event) => {
        console.log(event.target.value)
        setSex(event.target.value)
    }

    const handlerSnils = (event) => {
        setSnils(event.target.value)
    }

    function handlerPhone (event) {
        let tel = String(event.target.value)
        let newPhone = ""
        if (tel.length > 16) {
            let key
            let i = 0
            while(!key && i<phone.length && key !== 0) {
                if (tel[i] === phone[i]) {
                    i++
                } else {
                    key = i
                }
            }
            if (Number(tel[key]) || Number(tel[key]) === 0) {
                if (key<3 || key === 6 || key === 10 || key === 13) {
                    setSelection(key+1)
                } else if ((typeof key) === "number") {
                    newPhone = tel.substring(0, key+1) + tel.substring(key+2)
                    setSelection(key+1)
                    setPhone(newPhone)
                } else {
                    newPhone = tel.substring(0, 15) + tel.substring(16)
                    setSelection(15)
                    setPhone(newPhone)
                }
            } else {
                setSelection(key)
            }
            
        } else {
            let key
            let i = 0
            while(!key && i<phone.length && key !== 0) {
                if (tel[i] === phone[i]) {
                    i++
                } else {
                    key = i
                }
            }
            if (key<3 || key === 6 || key === 10 || key === 13) {
                if (key===0) {
                    setSelection(0)
                } else {
                    setSelection(key-1)
                }
            } else if ((typeof key) === "number") {
                if (phone[key] !== "_") {
                    newPhone = tel.substring(0, key) + "_" + tel.substring(key)
                    setSelection(key)
                    setPhone(newPhone)
                }
            } else {
                newPhone = tel.substring(0, 15) + tel.substring(16)
                setSelection(15)
                setPhone(newPhone)
            }
        }
        
    }

    const handlerAddress = (event) => {
        setAddress(event.target.value)
    }

    const handlerPolis = (event) => {
        let pol = String(event.target.value)
        let newPolis = ""
        if (pol.length > 13) {
            let key
            let i = 0
            while(!key && i<polis.length && key !== 0) {
                if (pol[i] === polis[i]) {
                    i++
                } else {
                    key = i
                }
            }
            if (Number(pol[key]) || Number(pol[key]) === 0) {
                if (key===2 || key === 5) {
                    setSelection1(key+1)
                } else if ((typeof key) === "number") {
                    newPolis = pol.substring(0, key+1) + pol.substring(key+2)
                    setSelection1(key+1)
                    setPolis(newPolis)
                } else {
                    newPolis = pol.substring(0, 12) + pol.substring(13)
                    setSelection1(12)
                    setPolis(newPolis)
                }
            } else {
                setSelection1(key)
            }
            
        } else {
            let key
            let i = 0
            while(!key && i<polis.length && key !== 0) {
                if (pol[i] === polis[i]) {
                    i++
                } else {
                    key = i
                }
            }
            if (key===2 || key === 5) {
                if (key===0) {
                    setSelection1(0)
                } else {
                    setSelection1(key)
                }
            } else if ((typeof key) === "number") {
                if (polis[key] !== "_") {
                    newPolis = pol.substring(0, key) + "_" + pol.substring(key)
                    setSelection1(key)
                    setPolis(newPolis)
                } 
            } else {
                newPolis = pol.substring(0, 15) + pol.substring(16)
                setSelection1(15)
                setPolis(newPolis)
            }
        }
        
        
    }

    const handlerBirthdate = (event) => {
        setBirthdate(event.target.value)
    }

    const handlerEmail = (event) => {
        setEmail(event.target.value)
    }

    const handlerLogin = (event) => {
        setLogin(event.target.value)
    }

    const handlerPassword = (event) => {
        setPassword(event.target.value)
    }

    const btnRegister = () => {
        const newPatient = {
            surname, 
            name, 
            patronymic, 
            sex, 
            snils, 
            phone: phone.split('-').join("").replace(')','').replace('(', ''), 
            address, 
            polis: polis.split(' ').join(''), 
            login, 
            password, 
            birthdate, 
            email
        }
        /////// registerHandler(surname, name, patronymic, sex, snils, phone, address, polis, login, password, birthdate, email)
        registerHandler(newPatient)

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
            <p>Регистрация</p>

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


            <div className="element-of-form-pol">
                <label className="one-header-elem-of-form">Пол</label>
                    <label htmlFor="male">М</label>
                    <input
                        value={"М"} 
                        onChange={handlerSex}  
                        name="sex" 
                        id="male" 
                        type="radio" 
                    />
                    <label htmlFor="female">Ж</label>
                    <input
                        value={"Ж"}
                        onChange={handlerSex}  
                        name="sex" 
                        id="female" 
                        type="radio" 
                    />
            </div>

            <div className="element-of-form">
                <label htmlFor="snils">СНИЛС</label>
                <input
                    value={snils} 
                    onChange={handlerSnils}  
                    name="snils" 
                    id="snils" 
                    type="text" 
                    placeholder="Введите СНИЛС"
                    required
                />
            </div>

            <div className="element-of-form">
                <label htmlFor="phone">Телефон</label>
                <input
                    value={phone} 
                    onChange={handlerPhone}  
                    // autoFocus={true}
                    name="phone" 
                    id="phone" 
                    type="tel" 
                    //pattern="\+7\s?[\(]{0,1}9[0-9]{2}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}"
                    // pattern="8-[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}"
                    required
                />
            </div>

            <div className="element-of-form">
                <label htmlFor="address">Адрес</label>
                <input
                    value={address} 
                    onChange={handlerAddress}  
                    name="address" 
                    id="address" 
                    type="text" 
                    placeholder="Введите адрес"
                    required
                />
            </div>

            <div className="element-of-form">
                <label htmlFor="polis">Полис</label>
                <input
                    value={polis} 
                    onChange={handlerPolis}  
                    name="polis" 
                    id="polis" 
                    type="text" 
                    placeholder="Введите полис"
                    required
                />
            </div>

            <div className="element-of-form">
                <label htmlFor="birthdate">Дата рождения</label>
                <input
                    value={birthdate} 
                    onChange={handlerBirthdate}  
                    name="birthdate" 
                    id="birthdate" 
                    type="date" 
                    required
                />
            </div>

            <div className="element-of-form">
                <label htmlFor="email">Email (при наличии)</label>
                <input
                    value={email} 
                    onChange={handlerEmail}  
                    name="email" 
                    id="email" 
                    type="email" 
                />
            </div>

            <div className="element-of-form">
                <label htmlFor="login">Логин</label>
                <input
                    value={login} 
                    onChange={handlerLogin}  
                    name="login" 
                    id="login" 
                    type="login" 
                    placeholder="Введите логин"
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
                Зарегистрироваться
            </button>
            <Link to="/"><button>Назад</button></Link>
        </div>
    )
}