import axios from 'axios'

let waiting = false

const get = (path, handler) => {
    if (waiting) return
    waiting = true
    axios.get(path)
        .then(response => {
            waiting = false
            handler(response)
        })
        .catch(error => {
            waiting = false
            console.log(error)
        })
}

const put = (path, data, handler) => {
    if (waiting) return
    waiting = true
    axios.put(path, data)
        .then(response => {
            waiting = false
            handler(response)
        })
        .catch(error => {
            waiting = false
            console.log(error)
        })

}

export default { get, put }