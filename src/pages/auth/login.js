import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Qrcodelogin from './qrcodelogin';
export default function Login({ user, onAuthentication }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);
    return (
        <div className='shadow-xl mt-32 p-10 text-grey-700 rounded'>
            <h2 className='text-3xl font-medium'>Join Today</h2>
            <Qrcodelogin onAuthentication={onAuthentication} />
        </div>
    );
}
