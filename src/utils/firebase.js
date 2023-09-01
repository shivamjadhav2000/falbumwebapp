import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_AUTH_KEY,
  authDomain: process.env.REACT_APP_API_AUTH_DOMAIN,
  databaseURL:process.env.REACT_APP_API_DATABASE_URL,
  projectId: process.env.REACT_APP_API_PROEJCT_ID,
  storageBucket:process.env.REACT_APP_API_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_API_MESSAGE_SENDGRID,
  appId: process.env.REACT_APP_API_APP_ID,
  measurementId: process.env.REACT_APP_API_MEASUREMENT_ID
};



async function getFCMTOKEN() {
  console.log('Requesting permission...');
  const FCMTOKEN=await Notification.requestPermission().then(async (permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.')
      const app = initializeApp(firebaseConfig)
      const messaging=getMessaging(app)
      
      const FCMtoken =await getToken(messaging,{vapidKey:process.env.REACT_APP_API_VAPIDKEY})

      .then((token)=>{
        if (token){
          return token
        }
        else{
          console.log("permission denied")
        }
      })
      return FCMtoken
    }
    
  })
    return FCMTOKEN
}
export {getFCMTOKEN  }







