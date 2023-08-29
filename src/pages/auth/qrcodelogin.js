import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Qrcodelogin({ onAuthentication }) {
    const [qrcode, setQrcode] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [user, setUser] = useState(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        } else {
            console.log("login");
        }
    }, [user]);

    useEffect(() => {
        // Fetch the QR code and session ID from the server
        axios.get(process.env.REACT_APP_API_URL + '/auth/qrcode')
            .then((res) => {
                setQrcode(res.data.qrCode);
                // Update the state with the session ID
                setSessionId(res.data.token);
            });
    }, []);

    // Function to periodically check for authentication status
    async function checkAuthStatus() {
        const res = await axios.get(process.env.REACT_APP_API_URL + '/auth/checkstatus', {
            params: { sessionId }
        });
        if (res.data.data) {
            const authenticatedUser = res.data.data;
            localStorage.setItem('user', JSON.stringify(authenticatedUser));
            setUser(authenticatedUser);
            onAuthentication(authenticatedUser); // Notify parent component of authentication
            clearInterval(intervalId); // Stop calling the function
        }
    }

    let intervalId;

    // Call the checkAuthStatus function every 5 seconds
    useEffect(() => {
        if (sessionId) {
            intervalId = setInterval(checkAuthStatus, 5000);
        }
        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [sessionId]);

    // Render the QR code and a message indicating the authentication status
    return (
        <div className="flex flex-row justify-around items-center">
            <div>
                {user ? (
                    <p>You are authenticated! {user.firstName}</p>
                ) : (
                    <>
                        <p className="text-2xl font-medium">Scan the code to sign into your account</p>
                        <p className="text-base ">Scan the code to sign into your account</p>
                    </>
                )}
            </div>
            {!user && <img src={qrcode} width={200} alt="QR code" />}
        </div>
    );
}

export default Qrcodelogin;
