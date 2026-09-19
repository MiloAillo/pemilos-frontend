import { apiUrl } from "@/lib/api";
import axios from "axios";
import { redirect } from "react-router-dom";

const userAuthLoader = async () => {
    try {
        const res = await axios.get(`${apiUrl}/auth/me`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Authorization": `${localStorage.getItem("Authorization")}`
            },
        })
        const data = res.data
        
        if (data.data.role?.toLowerCase() === "admin") {
            throw redirect("/admin")
        } else if(data.data.role?.toLowerCase() === "voter") {
            return data.data
        } else {
            throw redirect("/login")
        }
    } catch (error) {
        throw redirect("/login")
    }
}

export default userAuthLoader