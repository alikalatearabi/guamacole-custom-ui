import axios from "axios";

export const loginApi = (username: string, password: string) => {
    const data = {
        username: encodeURI(username),
        password: encodeURI(password)
    }
    return axios.post('http://localhost:8080/api/tokens?', data, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}
export const fetchUsersApi = () =>{
    return axios.get(`http://localhost:8080/api/session/data/postgresql/users`, {
        params: {
            "token": localStorage.getItem("token")
        }
    })
}

export const fetchRecentConnections = () => {
    return []
}