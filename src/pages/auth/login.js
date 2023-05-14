
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import Qrcodelogin from './qrcodelogin';
export default function Login(){
    const user=localStorage.getItem('user') || false
    const navigate =useNavigate()   
    useEffect (()=>{
        if (user){
            navigate('/')
        }
        else{
            console.log("login");
        }
    },[user])
    return (
        <div className='shadow-xl mt-32 p-10 text-grey-700 rounded'>
            <h2 className='text-3xl font-medium'>Join Today</h2>
            <Qrcodelogin />
        </div>
    )
}