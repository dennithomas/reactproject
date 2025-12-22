import { HashRouter, Route, Routes } from "react-router-dom";
import Loginpage from "./Loginpage";
import AdminPortal from "./components/Admin/AdminPortal";
import Userportal from "./components/User/Userportal";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/adminportal/*" element={<AdminPortal />} />
        <Route path="/userportal/*" element={<Userportal />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
