import { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'


function Qrcodelogin() {
    const [qrcode,setqrcode]=useState(null)
  const [sessionId, setSessionId] = useState(null);
  const navigate =useNavigate()
  const [user,setUser]=useState(localStorage.getItem('user'))
  useEffect (()=>{
    if (user){
        navigate('/')
    }
    else{
        console.log("login");
    }
},[user])
  useEffect(() => {
    // Fetch the QR code and session ID from the server
    axios.get(process.env.REACT_APP_API_URL+'/auth/qrcode')
      .then((res) => {
        setqrcode(res.data.qrCode)
        // Update the state with the session ID
        setSessionId(res.data.token);
      });
  }, []);
  
  // Function to periodically check for authentication status
  async function checkAuthStatus() {
    const res = await axios.get(process.env.REACT_APP_API_URL+'/auth/checkstatus', {
      params: { sessionId }
    });
    if (res.data.data) {
      const User=res.data.data
      localStorage.setItem('user',JSON.stringify(User))
      setUser(User)
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
    <div>
      {!user&& <img src={qrcode} alt="QR code" />}
      {user ? (
        <p>You are authenticated! {user.firstName}</p>
      ) : (
        <p>Waiting for authentication...</p>
      )}
    </div>
  );
}

export default Qrcodelogin;
