import { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/auth.context';
import { useRoutes } from './routes';

function App() {
  const {isAuthenticatedAdmin, isAuthenticatedDoctor, isAuthenticatedPatient, isRegistered, RegisteredHandler} = useContext(AuthContext)
  const routes = useRoutes(isAuthenticatedAdmin, isAuthenticatedDoctor, isAuthenticatedPatient, isRegistered)
  RegisteredHandler()

  return (
    <>
      <Router>
        {routes}
      </Router>
    </>
  )
}

export default App;
