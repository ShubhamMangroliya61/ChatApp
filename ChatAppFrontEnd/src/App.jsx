import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { resetError, useSelectorUserState } from "./redux/slice/AuthSlice";
import { useEffect, useMemo } from "react";
import { AuthRoutes, NormalRoutes } from "./routes/CustomRoutes";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const validateToken = () => {
    const token = localStorage.getItem("token");
    return token ? isTokenValid() : false;
  };

  const decodeToken = () => {
    const token = localStorage.getItem("token");
    let finalDecodedToken = null;
    try {
      finalDecodedToken = token ? jwtDecode(token) : null;
    } catch (error) {
      finalDecodedToken = null;
    }
    return finalDecodedToken;
  };

  const isTokenValid = () => {
    const expiryTime = decodeToken()?.exp;
    if (expiryTime) {
      return 1000 * expiryTime > new Date().getTime();
    } else {
      return false;
    }
  };
  const RoutesComponent = useMemo(
    () => (validateToken() ? <NormalRoutes /> : <AuthRoutes />),
    [validateToken()]
  );

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch, location.pathname]);

  return <>{RoutesComponent}</>;
};

export default App;
