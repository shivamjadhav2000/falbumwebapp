import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "../utils/firebase";
import { useNavigate} from 'react-router-dom'
import React, { useState, useEffect } from 'react';

export default function Dashboard(){
    const navigate =useNavigate()

const [user,loading]=useAuthState(auth)
if (loading) return <h1>Loading...</h1>
if (!user) return navigate("/login")
if (user){
    return (
        <div>
            <h1 className="py-4 text-lg font-medium">Welcome to your dashboard {user.displayName}</h1>
            <button className="py-2 px-2 text-sm bg-red-500 text-white rounded-lg font-medium" onClick={()=>{auth.signOut()}}>Signout</button>
        </div>
    )
}
}

