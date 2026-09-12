import { apiUrl } from "@/lib/api";
import axios from "axios";
import { redirect } from "react-router-dom";

const AdminAuthLoader = async () => {
    try {
        const res = axios.get(`${apiUrl}/auth/me`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Authorization": `${localStorage.getItem("Authorization")}`
            },
        })
        const data = (await res).data
        if (data.data.role === "admin") {
            return data.data
        } else if(data.data.role === "voter") {
            throw redirect("/")
        } else {
            throw redirect("/login")
        }
    } catch {
        throw redirect("/login")
    }
}

export default AdminAuthLoader