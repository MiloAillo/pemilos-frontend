import { apiUrl } from "@/lib/api";
import axios from "axios";
import { redirect } from "react-router-dom";

const AdminAuthLoader = async () => {
    try {
        const res = await axios.get(`${apiUrl}/auth/me`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Authorization": `${localStorage.getItem("Authorization")}`
            },
        })
        const data = res.data
        
        if (data.data.role?.toLowerCase() === "admin") {
            return data.data
        } else if(data.data.role?.toLowerCase() === "voter") {
            throw redirect("/")
        } else {
            throw redirect("/login")
        }
    } catch (error) {
        throw redirect("/login")
    }
}

export default AdminAuthLoader