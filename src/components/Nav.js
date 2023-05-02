import { Link } from 'react-router-dom';
// import {useAuthState} from 'react-firebase-hooks/auth';
// import {auth} from '../utils/firebase'
export default function Nav(){
    const user=JSON.parse(localStorage.getItem('user'))
    return (
        <nav>
            <ul className="flex justify-between items-center p-2 rounded bg-blue-500 ">
                <Link to={'/'}><li className='uppercase font-sans text-2xl text-white'>FalBum</li></Link>
                {!user && (
                 <Link to={'/login'}>
                    <li className="py-2 px-4 text-lg bg-teal-500 text-white rounded-lg font-medium font-bold">
                        JOIN NOW
                    </li>
                </Link>
                )}
                {user && (
                    <div >
                        <Link to={"/dashboard"}>
                            <img src={user.profileImage} className='rounded-full' style={{width:'60px'}}   alt="user" />
                        </Link>
                    </div>
                )}
            </ul>
        </nav>
    )
}