import api from "./baseApi.ts";

export const listConnectionsApi = () => {
    return api.get(`/api/session/data/mysql/connectionGroups/ROOT/tree`, {
        params: {
            "token": localStorage.getItem("token")
        },
    })
}

export const detailsConnectionApi = (id: string) => {
    return api.get(`e/api/session/data/mysql/connections/${id}`, {
        params: {
            "token": localStorage.getItem("token")
        },
    })
}

export const detailsConnectionParametersApi = (id: string) => {
    return api.get(`/api/session/data/mysql/connections/${id}/parameters`, {
        params: {
            "token": localStorage.getItem("token")
        },
    })
}

export const detailsConnectionHistoryApi = (id: string) => {
    return api.get(`/api/session/data/mysql/connections/${id}/history`, {
        params: {
            "token": localStorage.getItem("token")
        },
    })
}

export const ConnectionsHistoryApi = () => {
    return api.get(`/api/session/data/mysql/history/connections`, {
        params: {
            order: '-startDate',
            "token": localStorage.getItem("token")
        },
    })
}

export const addConnectionApi = (data) => {
    return api.post('/api/session/data/mysql/connections', data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}

export const updateConnectionApi = (data, id: string) => {
    return api.put(`/api/session/data/mysql/connections/${id}`, data, {
        params: {
            "token": localStorage.getItem("token")
        },
        headers: {
            "content-type": "application/json;charset=UTF-8"
        }
    })
}

export const deleteConnectionApi = (id: string) => {
    return api.delete(`/api/session/data/mysql/connections/${id}`, {
        params: {
            "token": localStorage.getItem("token")
        },
    })
}




