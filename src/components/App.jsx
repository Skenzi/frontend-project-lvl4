import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import {
  Button, Navbar, Container,
} from 'react-bootstrap';
import LoginPage from './LoginPage.jsx';
import ChatPage from './ChatPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import SignUpPage from './SignUp.jsx';
import authContext from '../context/index.js';
import useAuth from '../hooks/index.js';
import {
  fetchContent,
} from '../features/channelsSlice';

const ChatRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (
        auth.loggedIn ? children : <Redirect to={{ pathname: '/login', state: { from: location } }} />)}
    />
  );
};

const AuthProvider = ({ children, promiseSocket, checkToken }) => {
  const [loggedIn, setLoggedIn] = useState(checkToken());
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };
  const dispatch = useDispatch();
  if (checkToken()) {
    dispatch(fetchContent());
  }

  return (
    <authContext.Provider value={{
      loggedIn, logIn, logOut, promiseSocket,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const i18n = useTranslation();
  return auth.loggedIn ? (
    <Button onClick={() => {
      auth.logOut();
    }}
    >
      {i18n.t('login.logOut')}
    </Button>
  ) : null;
};

const App = ({ promiseSocket, checkToken }) => (
  <AuthProvider promiseSocket={promiseSocket} checkToken={checkToken}>
    <div className="d-flex flex-column h-100">
      <Router>
        <Navbar bg="white" variant="light" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
            <AuthButton />
          </Container>
        </Navbar>

        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
          <ChatRoute path="/">
            <ChatPage />
          </ChatRoute>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </Router>
    </div>
  </AuthProvider>
);
export default App;
