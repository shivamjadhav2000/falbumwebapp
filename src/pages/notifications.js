import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import { Button } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: 'none', // Remove default box shadow
}));

function Notification({ user }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [notificationsPerPage] = useState(3); // Number of notifications per page

    useEffect(() => {
        fetchNotifications(currentPage);
    }, [currentPage]);

    const fetchNotifications = (page) => {
        setLoading(true);
        axios
            .get(process.env.REACT_APP_API_URL + '/common/users/notifications', {
                headers: {
                    Authorization: 'Bearer ' + user.token,
                },
                params: {
                    page,
                    limit: notificationsPerPage,
                },
            })
            .then((response) => {
                setNotifications(response.data.notifications);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching notifications:', error);
                setLoading(false);
            });
    };

    if (loading) {
        return <div>Loading notifications...</div>;
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="notification-list">
            <h1 className="font-sans leading-loose font-semibold">Notifications</h1>

            <Box sx={{ width: '100%' }}>
                <Stack spacing={2}>
                    {notifications.map((notification) => (
                        <Item key={notification._id} className='card border'>
                            <div className="flex justify-between items-center mb-2">
                                    <div className="text-blue-500">{notification.notificationType}</div>
                                    <div className="text-gray-600">{notification.timestamp}</div>
                            </div>
                            <p className="text-gray-800 text-left">{notification.message}</p>
                        </Item>
                    ))}
                </Stack>
            </Box>
            <Pagination
                count={Math.ceil(notifications.length / notificationsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
            />
            {currentPage > 1 && (
                <Button variant="outlined" onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous Page
                </Button>
            )}
            {notifications.length === notificationsPerPage && (
                <Button variant="outlined" onClick={() => setCurrentPage(currentPage + 1)}>
                    Next Page
                </Button>
            )}
        </div>
    );
}

export default Notification;
