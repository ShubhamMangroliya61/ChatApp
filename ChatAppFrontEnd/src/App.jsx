import './App.css'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { resetError, useSelectorUserState } from './redux/slice/AuthSlice';
import { useEffect } from 'react';
import { AuthRoutes, NormalRoutes } from './routes/CustomRoutes';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn } = useSelectorUserState();
  useEffect(() => {
    dispatch(resetError());
  },[location.pathname])
  return <> {isLoggedIn ? <NormalRoutes /> : <AuthRoutes />}</>

}
export default App
