import { HashRouter, Route, Routes } from "react-router-dom";
import SignUp from "../pages/signUp/Signup";
import Login from "../pages/login/Login";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}
