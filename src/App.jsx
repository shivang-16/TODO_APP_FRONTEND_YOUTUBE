import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/Login/Singup";
import Home from "./components/Home/Home";
import "./App.css";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
