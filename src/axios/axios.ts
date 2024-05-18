import axios from "axios";

const _axios = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_MOCK_URL,
    baseURL: "http://localhost:3001/",
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    }
})

const appAxios = async (url: string, method: string = "GET", options: {
    data: any,
    headers: Record<string, any>
} = {
    data: null,
    headers: {}
}) => {
    return await _axios.request({
        method,
        url,
        ...options,
    })
}

export default appAxios