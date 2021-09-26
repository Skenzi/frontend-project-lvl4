import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { authContext } from '../context/index.js';
import { useAuth } from '../hooks/index.js';

const PrivateRoute = ({ path }) => {
  const { userId } = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (
        userId.token ? <ChatPage /> : <Redirect to={{ pathname: '/login', state: { from: location } }} />)}
    />
  );
};

const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => JSON.parse(localStorage.getItem('userId')) || {
    username: null,
    token: null,
  });
  const logIn = (userData) => {
    localStorage.setItem('userId', JSON.stringify(userData));
    setUserId({
      username: userData.username,
      token: userData.token,
    });
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setUserId({
      username: null,
      token: null,
    });
  };

  const userRequestOptions = userId.token ? { Authorization: `Bearer ${userId.token}` } : {};

  return (
    <authContext.Provider value={{
      logIn, logOut, userRequestOptions, userId, setUserId,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const i18n = useTranslation();
  return auth.userId.token ? (
    <Button onClick={() => {
      auth.logOut();
    }}
    >
      {i18n.t('login.logOut')}
    </Button>
  ) : null;
};

const App = () => (
  <AuthProvider>
    <div className="d-flex flex-column h-100">
      <Router>
        <Navbar bg="white" variant="light" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
            <AuthButton />
          </Container>
        </Navbar>

        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/signup">
            <SignUpPage />
          </Route>
          <PrivateRoute exact path="/" />
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </Router>
    </div>
  </AuthProvider>
);
export default App;
