import React, { useState } from 'react';
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
import authContext from '../context/index.jsx';
import useAuth from '../hooks/index.jsx';

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
  return auth.loggedIn ? (
    <Button onClick={() => {
      auth.logOut();
      auth.signUpOpen();
    }}
    >
      Log out
    </Button>
  ) : null;
};

const SignUpButton = () => {
  const auth = useAuth();
  return auth.signUp && !auth.loggedIn ? (
    <Button as={Link} to="/signup">
      Sign Up
    </Button>
  ) : null;
};

const App = ({ socket }) => (
  <AuthProvider>
    <Router>
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          <AuthButton />
          <SignUpButton />
        </Container>
      </Navbar>

      <div className="container p-3">
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
      </div>
    </Router>
  </AuthProvider>
);
export default App;
