import api from "./baseApi.ts";

export const activeConnectionsApi = () => {
    return api.get(`/api/session/data/mysql/activeConnections`, {
        params: {
            "token": localStorage.getItem("token")
        },
    })
}

export const killConnectionsApi = (id: string) => {
    const data = [{
        "op": "remove",
        "path": `/${id}`
    }]
    return api.patch(`/api/session/data/mysql/activeConnections`, data,{
        params: {
            "token": localStorage.getItem("token")
        },
    })
}
