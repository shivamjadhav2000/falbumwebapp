// import { useAuthState } from "react-firebase-hooks/auth";
// import {auth} from "../utils/firebase";
import { useNavigate} from 'react-router-dom'

export default function Dashboard(){
    const navigate =useNavigate()
const user=JSON.parse(localStorage.getItem('user'))
if (!user) return navigate("/login")
if (user){
    return (
        <div>
            <h1 className="py-4 text-lg font-medium">Welcome to your dashboard {user.firstName}</h1>
            <button className="py-2 px-2 text-sm bg-red-500 text-white rounded-lg font-medium" onClick={()=>{localStorage.removeItem('user')}}>Signout</button>
        </div>
    )
}
}

