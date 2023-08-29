import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

export default function Nav({ user }) {
    return (
        <nav>
            <ul className="flex justify-between items-center p-2 rounded bg-blue-500">
                <li className='uppercase font-sans text-2xl text-white'>
                    <Link to={'/'}>FalBum</Link>
                </li>
                <div className="flex items-center space-x-4">
                    {user && (
                        <Link to={"/dashboard"}>
                            <img src={user.profileImage} className='rounded-full' style={{ width: '50px', height: '50px' }} alt="user" />
                        </Link>
                    )}
                    <Link to={'/notifications'}>
                        <IconButton edge="end" aria-label="delete">
                            <NotificationsOutlinedIcon style={{ color: 'white' }} fontSize="large" />
                        </IconButton>
                    </Link>
                </div>
            </ul>
        </nav>
    );
}
