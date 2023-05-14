import {FcGoogle} from 'react-icons/fc';
import {AiFillFacebook} from 'react-icons/ai';
import {GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
import {auth} from "../../utils/firebase"
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Qrcodelogin from './qrcodelogin';
export default function Login(){
    const [user,loading]=useAuthState(auth)
    const navigate =useNavigate()

    //sign in with google
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async()=>{
        try{
            await signInWithPopup(auth,googleProvider);
            navigate('/')
        }
        catch(error){
            console.log(error)
        }
    }
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