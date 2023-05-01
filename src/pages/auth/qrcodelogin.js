import { useState, useEffect } from "react";
import axios from "axios";


function Qrcodelogin() {
    const [qrcode,setqrcode]=useState(null)
  const [sessionId, setSessionId] = useState(null);
  const [Mytoken,setToken]=useState(null)
  
  useEffect(() => {
    // Fetch the QR code and session ID from the server
    console.log("process.env.REACT_APP_API_UR=",process.env.REACT_APP_API_URL+'/auth/qrcode')
    axios.get(process.env.REACT_APP_API_URL+'/auth/qrcode')
      .then((res) => {
        setqrcode(res.data.qrCode)
        // Update the state with the session ID
        setSessionId(res.data.token);
      });
  }, []);
  
  // Function to periodically check for authentication status
  async function checkAuthStatus() {
    const response = await axios.get(process.env.REACT_APP_API_URL+'/auth/checkstatus', {
      params: { sessionId }
    });
    console.log(response)
    const { authentication, token } = response.data;
    if (authentication) {
      localStorage.setItem("token", token);
      setToken(token)
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
      {!localStorage.getItem('token') && <img src={qrcode} alt="QR code" />}
      {localStorage.getItem("token") ? (
        <p>You are authenticated! token is here={Mytoken}</p>
      ) : (
        <p>Waiting for authentication...</p>
      )}
    </div>
  );
}

export default Qrcodelogin;
