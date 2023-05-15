import React, { useEffect } from "react"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Message } from "../components/Message"
import { useMessage } from "../hooks/message.hook"

const crc32 =require('crc-32')



const htmlTrue = `981977849`

// Для справочной информации

export const AboutPage = () => {

    const {message, showMessage, hideMessage} = useMessage()

    useEffect(() => {
        if (message) {
            const inter = setInterval(() => {
                hideMessage()
                clearInterval(inter)
            }, 5000)
        }
    }, [message])

    const clickHandler = () => {
        const reqToPath = async() => {
            try {
                const res = await fetch('/about.html', {method:'GET', headers: {['Content-type']:'application/html'}})
                if (res.status === 404) {
                    showMessage('Нет такого файла')
                } else {
                    const info = await res.text()
                    const hash = crc32.str(info)
                    // console.log(hash)
                    //Раскомментировать, когда будет точно известен htmlTrue
                    if (String(hash) === htmlTrue) {
                        const link = document.createElement('a')
                        link.setAttribute('href', '/about.html')
                        link.setAttribute('target', 'blank')
                        link.click()
                    } else {
                        showMessage('Файл справочной информации со сведениями о системе был повреждён')
                    }
                }
            } catch (e) {
                showMessage("Ошибка при отправке запроса - "+e)
            }
        }
        reqToPath()
    }






    return (
        <>
            <Header/>
            <main>
                {message && <Message message={message}/>}
                <div className="instruction">
                    <span>Сведения о разработчике</span>
                    <p>Самарский университет</p>
                    <p>Институт информатики и кибернетики</p>
                    <span>Выпускная квалификационная работа</span>
                    <span>
                        на тему: "Разработка автоматизированной системы определения риска первичной резекции кишки
                        при опухолевой толстокишечной непроходимости"
                    </span>
                    <p></p>
                    <p>Разработчик (студент группы 6415-020302D):</p>
                    <span>Пирюшов А.С.</span>
                    <span className="instruction-year">2023г.</span>
                    <button onClick={clickHandler}>Перейти к сведениям о системе</button>
                </div>
            </main>
            <Footer/>
        </>
    )
}