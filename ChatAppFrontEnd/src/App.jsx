import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { resetError, useSelectorUserState } from './redux/slice/AuthSlice';
import { useEffect, useMemo } from 'react';
import { AuthRoutes, NormalRoutes } from './routes/CustomRoutes';
import { isTokenValid } from './utils/AuthService';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const validateToken = () => {
    const token = localStorage.getItem("token");
    return token ? isTokenValid() : false;
  };

  const RoutesComponent = useMemo(() => (
    validateToken() ? <NormalRoutes /> : <AuthRoutes />
  ), [validateToken()]);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch, location.pathname]);

  return <>{RoutesComponent}</>;
};

export default App;
