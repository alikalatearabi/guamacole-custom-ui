import api from "./baseApi.ts";

export const loginApi = (username: string, password: string) => {
    const data = {
        username: encodeURI(username),
        password: encodeURI(password)
    }
    return api.post('/api/tokens', data, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}
export const LogoutApi = (token: string) =>{
    return api.delete(`/api/tokens/${token}`, {
        params: {
            "token": localStorage.getItem("token")
        }
    })
}
export const fetchUsersApi = () => {
    return api.get(`/api/session/data/mysql/users`, {
        params: {
            "token": localStorage.getItem("token")
        }
    })
}
export const fetchUsersAttributesAPI = (user: string | undefined) => {
    return api.get(`/api/session/data/postgresql/users/${user}`, {
        params: {
            "token": localStorage.getItem("token")
        }
    })
}
export const fetchUsersPermissionsAPI = (user: string | undefined) => {
    return api.get(`/session/data/postgresql/users/${user}/permissions`, {
        params: {
            "token": localStorage.getItem("token")
        },
    })
}
export const postUsersEditAttributes = (user: string | undefined, data: any) => {
    return api.put(`/session/data/postgresql/users/${user}`, data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const patchUserPermissions = (user: string | undefined, data: any) => {
    return api.patch(`/api/session/data/postgresql/users/${user}/permissions`, data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const addUserApi = (data: any) => {
    return api.post(`/api/session/data/mysql/users`, data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const fetchGroupApi = () => {
    return api.get(`/session/data/postgresql/userGroups`, {
        params: {"token": localStorage.getItem("token")},
    })
}
export const addGroupApi = (data: {
    attributes: { disabled: string },
    identifier: string
}) => {
    return api.post(`/session/data/postgresql/userGroups`, data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const updateGroupApi = (data: { attributes: { disabled: string }, identifier: string }, name: string) => {
    return api.put(`e/api/session/data/postgresql/userGroups/${name}`, data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const addGroupPermissionsApi = (data: { op: string, path: string, value: string }[], name: string) => {
    return api.patch(`/api/session/data/postgresql/userGroups/${name}/permissions`, data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const addGroupMembers = (data: { op: string, path: string, value: string }[], name: string) => {
    return api.patch(`/api/session/data/postgresql/userGroups/${name}/memberUsers`, data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}
export const fetchSelectedGroupApi = (name: string) => {
    return api.get(`/api/session/data/postgresql/userGroups/${name}`, {
        params: {"token": localStorage.getItem("token")},
    })
}
export const fetchSelectedGroupPermissions = (name: string) => {
    return api.get(`/api/session/data/postgresql/userGroups/${name}/permissions`, {
        params: {"token": localStorage.getItem("token")},
    })
}
export const fetchSelectedGroupMembers = (name: string) => {
    return api.get(`/api/session/data/postgresql/userGroups/${name}/memberUsers`, {
        params: {"token": localStorage.getItem("token")},
    })
}