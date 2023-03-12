import Layout from './components/layout';
import Login from "./pages/auth/login"
import MainPage from "./pages/mainpage/mainpage"
import Dashboard from './pages/dashboard';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';


function App() {
  return (
    <Router >
      <Layout className="text-white font-medium m-20">
      <Routes>
          <Route exact path="/" element={<MainPage/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/dashboard" element={<Dashboard/>}/>
      </Routes>
               
      </Layout>
  

 </Router>
     
    
  );
}

export default App;
