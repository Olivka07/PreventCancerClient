import { createContext, useEffect, useState } from "react";
import { Message } from "../components/Message";
import { useMessage } from "../hooks/message.hook";
import {request} from "../request/request"

const storageName = 'userData'

export const AuthContext = createContext({
    userId: null,
    registerHandler: () => {},
    loginHandler: () => {},
    logoutHandler: () => {},
    registeredHandler: () => {},
    isAuthenticatedAdmin: false,
    isAuthenticatedDoctor: false,
    isAuthenticatedPatient: false, 
    isRegistered: false
})

export const AuthState = ({children}) => {
    const {message, showMessage, hideMessage} = useMessage()
    const [userId, setUserId] = useState(null)
    const [isRegistered, setIsRegistered] = useState(false)
    const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false)
    const [isAuthenticatedDoctor, setIsAuthenticatedDoctor] = useState(false)
    const [isAuthenticatedPatient, setIsAuthenticatedPatient] = useState(false)

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    const registerHandler = async (newUser, role = null) => {
        if (!role) {
            const response = await request('/api/auth/register/patient', 'POST', newUser)
            if (response.ok) {
                alert('Регистрация прошла успешно!')
                setIsRegistered(true)
                return true
            }
            else {
                showMessage(response.message)
                return false
            }
        } else {
            const response = await request('/api/auth/register/doctor', 'POST', newUser)
            if (response.ok) {
                alert('Регистрация прошла успешно!')
                setIsRegistered(true)
                return true
            }
            else {
                showMessage(response.message)
                return false
            }
        }
    }


    const loginHandler = async (login, password) => {
        if (login === 'admin' && password === 'admin') {
            setIsAuthenticatedAdmin(true)
            setUserId("admin")
            localStorage.setItem(storageName, JSON.stringify({
                role:2, userId:"admin"
            }))
        }
        else {
            const response = await request('/api/auth/login', 'POST', {login, password})
            if (response.role === 0) {
                setUserId(response.userId)
                setIsAuthenticatedPatient(true)
                localStorage.setItem(storageName, JSON.stringify({
                    role:0, userId:response.userId
                }))
            }
            else if (response.role === 1) {
                setUserId(response.userId)
                setIsAuthenticatedDoctor(true)
                localStorage.setItem(storageName, JSON.stringify({
                    role:1, userId:response.userId
                }))
            }
            else {
                showMessage(response.message)
            }
        }
    }

    const logoutHandler = () => {
        setUserId(() => null)
        setIsAuthenticatedAdmin(() => false)
        setIsAuthenticatedDoctor(() => false)
        setIsAuthenticatedPatient(() => false)
        localStorage.removeItem(storageName)
    }

    const RegisteredHandler = () => {
        useEffect(() => {
            setIsRegistered(false)
        })
    }

    useEffect(() => {
        async function fetchData() {
            const data = JSON.parse(localStorage.getItem(storageName))
            if (data && data.userId) {
                if (data.role === 2) {
                    setIsAuthenticatedAdmin(true)
                    setUserId("admin")
                } else if (data.role === 1) {
                    const response = await request('/api/auth/getdoctor', 'POST', {id:data.userId})
                    if (response.userId) {
                        setUserId(response.userId)
                        setIsAuthenticatedDoctor(true)
                    }
                } else if (data.role === 0) {
                    const response = await request('/api/auth/getpatient', 'POST', {id:data.userId})
                    if (response.userId) {
                        setUserId(response.userId)
                        setIsAuthenticatedPatient(true)
                    }
                }
            }
        }
        fetchData()
    }, [])

    return (
        <AuthContext.Provider value={{isRegistered, userId, RegisteredHandler, registerHandler, loginHandler, logoutHandler ,isAuthenticatedAdmin, isAuthenticatedDoctor, isAuthenticatedPatient}}>
            {message && <Message message={message}/>}
            {children}
        </AuthContext.Provider>
    )
}