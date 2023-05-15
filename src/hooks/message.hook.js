import {  useCallback, useState } from "react"

export const useMessage = () => {
    const [message, setMessage] = useState(null)
    const showMessage = (text) => {
        setMessage(text)
    }
    const hideMessage = () => {
        setMessage(null)
    }
    return {message, showMessage, hideMessage}
} 