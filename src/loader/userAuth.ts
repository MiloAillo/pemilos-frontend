import { apiUrl } from "@/lib/api";
import axios from "axios";
import { redirect } from "react-router-dom";

const userAuthLoader = async () => {
    try {
        const res = axios.get(`${apiUrl}/auth/me`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Authorization": `${localStorage.getItem("Authorization")}`
            },
        })
        const data = (await res).data
        if (data.data.role === "admin") {
            throw redirect("/admin")
        } else if(data.data.role === "voter") {
            return data.data
        } else {
            throw redirect("/login")
        }
    } catch {
        throw redirect("/login")
    }
}

export default userAuthLoader