import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import MarketPage from "./pages/Market";

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path='/market' element={<MarketPage/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
