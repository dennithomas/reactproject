import { BrowserRouter, Route, Routes } from "react-router-dom"
import Loginpage from "./Loginpage"
import AdminPortal from "./components/Admin/AdminPortal"
import Userportal from "./components/User/Userportal"

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage/>}></Route>
        <Route path="/adminportal/*" element={<AdminPortal/>}></Route>
        <Route path="/userportal/*" element={<Userportal/>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
