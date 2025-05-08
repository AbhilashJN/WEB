import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import TradePage from "./pages/Trade";
import AnalyzePage from "./pages/Analyze";

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/portfolio" element={<ProfilePage />} />
      <Route path='/trade' element={<TradePage/>} />
      <Route path='/analyze' element={<AnalyzePage/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
