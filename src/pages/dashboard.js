import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "../utils/firebase";
import {json, useNavigate} from 'react-router-dom'
import React, { useState, useEffect } from 'react';

export default function Dashboard(){
    const navigate =useNavigate()

    //
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Make a GET request to the /qr-code endpoint to get the QR code data URL and token
    fetch('http://localhost:8080/qr-code')
      .then(response => response.json())
      .then(data => {
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setToken(data.token);
      });
  }, []);
    //
const [user,loading]=useAuthState(auth)
if (loading) return <h1>Loading...</h1>
if (!user) return navigate("/login")
if (user){
    return (
        <div>
            <h1 className="py-4 text-lg font-medium">Welcome to your dashboard {user.displayName}</h1>
            <button className="py-2 px-2 text-sm bg-red-500 text-white rounded-lg font-medium" onClick={()=>{auth.signOut()}}>Signout</button>
            <div>
                <img src={qrCodeDataUrl} alt="QR code" />
                <p>{token}</p>
            </div>
        </div>
    )
}
}








// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const POLL_INTERVAL = 5000; // 5 seconds

// const Login = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       const response = await axios.get('/api/check-authentication');
//       setIsAuthenticated(response.data.isAuthenticated);
//     };

//     const interval = setInterval(() => {
//       checkAuthentication();
//     }, POLL_INTERVAL);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div>
//       {isAuthenticated ? (
//         <p>User is authenticated!</p>
//       ) : (
//         <p>User is not yet authenticated. Please scan the QR code with your phone.</p>
//       )}
//     </div>
//   );
// };

// export default Login;



// node js
// on
// app.get('/api/check-authentication', (req, res) => {
//   const sessionId = req.cookies.sessionId;

//   if (!sessionId) {
//     res.json({ isAuthenticated: false });
//     return;
//   }

//   const session = sessions[sessionId];

//   if (!session || !session.userId) {
//     res.json({ isAuthenticated: false });
//     return;
//   }

//   res.json({ isAuthenticated: true });
// });
