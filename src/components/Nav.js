import { Link } from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../utils/firebase'
export default function Nav(){
    const [user,loading]=useAuthState(auth);
    return (
        <nav>
            <ul className="flex justify-between items-center py-10 px-2 ">
                <Link to={'/'}><li>FalBum</li></Link>
                {!user && (
                 <Link to={'/login'}>
                    <li className="py-2 px-4 text-lg bg-teal-500 text-white rounded-lg font-medium">
                        JOIN NOW
                    </li>
                </Link>
                )}
                {user && (
                    <div>
                        <Link to={"/dashboard"}>
                            <img src={user.photoURL} alt="user" />
                        </Link>
                    </div>
                )}
            </ul>
        </nav>
    )
}