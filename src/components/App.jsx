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
import authContext from '../context/index.js';
import useAuth from '../hooks/index.js';

const checkToken = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  return userId && userId.token;
};

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

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(checkToken());
  const [signUp, setSignUp] = useState(true);
  const signUpOpen = () => setSignUp(true);
  const signUpClose = () => setSignUp(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      loggedIn, logIn, logOut, signUpOpen, signUpClose, signUp,
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
      auth.signUpOpen();
    }}
    >
      {i18n.t('login.logOut')}
    </Button>
  ) : null;
};

const SignUpButton = () => {
  const auth = useAuth();
  const i18n = useTranslation();
  return auth.signUp && !auth.loggedIn ? (
    <Button as={Link} to="/signup">
      {i18n.t('signup.register')}
    </Button>
  ) : null;
};

const App = ({ socket }) => (
  <AuthProvider>
    <div className="d-flex flex-column h-100">
      <Router>
        <Navbar bg="light" variant="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
            <AuthButton />
            <SignUpButton />
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
            <ChatPage socket={socket} />
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
