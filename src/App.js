import Layout from './components/layout';
import Login from "./pages/auth/login"
import MainPage from "./pages/mainpage/mainpage"
import Dashboard from './pages/dashboard';
import Notification from './pages/notifications';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const handleAuthentication = (authenticatedUser) => {
        setUser(authenticatedUser);
    };

    const handleLogout = () => {
        // Perform logout logic
        // Clear user from local storage
        localStorage.removeItem('user');
        // Update user state
        setUser(null);
    };
  return (
    <Router >
      <Layout className="text-white font-medium" user={user}>
      <Routes>
          <Route exact path="/" element={<MainPage/>}/>
          <Route exact path="/login"  user={user} element={<Login onAuthentication={handleAuthentication} />}/>
          <Route exact path="/dashboard" element={<Dashboard user={user}  onLogout={handleLogout} />}/>
          <Route exact path="/notifications" element={<Notification user={user} />}/>
      </Routes>
      </Layout>
 </Router>
     
    
  );
}

export default App;
