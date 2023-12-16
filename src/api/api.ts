import axios from "axios";
import {UsersData} from "../pages/users";

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
export const fetchUsersAttributesAPI = (user: string | undefined) =>{
    return axios.get(`http://localhost:8080/api/session/data/postgresql/users/${user}`, {
        params: {
            "token": localStorage.getItem("token")
        }
    })
}
export const fetchUsersPermissionsAPI = (user: string | undefined) => {
    return axios.get(`http://localhost:8080/api/session/data/postgresql/users/${user}/permissions`, {
        params: {
            "token": localStorage.getItem("token")
        },
    })
}
export const postUsersEditAttributes = (user: string | undefined, data: any) => {
    return axios.put(`http://localhost:3000/api/session/data/postgresql/users/${user}`, data,{
        params: {
            "token": localStorage.getItem("token")
        },
        headers:{
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const patchUserPermissions = (user: string | undefined, data: any) => {
    return axios.patch(`http://localhost:3000/api/session/data/postgresql/users/${user}/permissions`, data,{
        params: {
            "token": localStorage.getItem("token")
        },
        headers:{
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const addUserApi = (data: any) =>{
    return axios.post(`http://localhost:3000/api/session/data/postgresql/users`, data,{
        params: {
            "token": localStorage.getItem("token")
        },
        headers:{
            "content-type": "application/json;charset=UTF-8"
        }
    })
}


export const fetchRecentConnections = () => {
    return []
}