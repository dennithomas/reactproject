import {  Route, Routes } from "react-router-dom";
import Loginpage from "./Loginpage";
import AdminPortal from "./components/Admin/AdminPortal";
import Userportal from "./components/User/Userportal";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/adminportal/*" element={<AdminPortal />} />
        <Route path="/userportal/*" element={<Userportal />} />
      </Routes>
  );
}

export default App;
