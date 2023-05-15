
export async function request(url, method = "GET", data = null) {
    try {
        const headers = {}
        let body
        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }
        const newUrl = 'https://preventcancerserver.up.railway.app'+url
        const response = await fetch(newUrl, {
            method,
            body,
            headers,
        })
        const resjs = await response.json()
        if (response.ok) {
            resjs.ok = true
        } else {
            resjs.ok = false
        }
        return resjs
    } catch(e) {
        console.log('Ошибка - ', e.message)
    }
}