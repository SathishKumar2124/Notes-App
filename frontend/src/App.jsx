import Home from "./pages/Home/Home";
import {BrowserRouter as Router , Route,Routes} from 'react-router-dom'
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";

export default function App() {
  return (
    <div className="w-full  bg-gray-100 min-h-screen">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  )
}