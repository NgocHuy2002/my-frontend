import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginScreen from './Screen/Login/login.js';
import HomeScreen from './Screen/Home/home.js'
function App() {
  return (
    // <LoginScreen/>
<Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
