
import { AllRoutes } from "../constatns/Routes";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Signup/SignUp";
import Home from "../pages/Home/Home";



export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path={AllRoutes.Login} element={<Login />}></Route>
      <Route path={AllRoutes.SignUp} element={<SignUp />}></Route>

      <Route path="/*" element={<Navigate to={AllRoutes.Login} />} ></Route>
    </Routes>
  );
};

export const NormalRoutes = () => {
  return (
    <Routes>
      <Route path={AllRoutes.Home} element={<Home/>}></Route>
   
      <Route path="/*" element={<Navigate to={AllRoutes.Home} />} />
    </Routes>
  );
};