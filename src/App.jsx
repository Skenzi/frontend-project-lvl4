import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import {
  Button, Navbar, Container,
} from 'react-bootstrap';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { authContext } from './context/index.js';
import { useAuth } from './hooks/index.js';
import routes from './routes.js';

const AuthProvider = ({ children }) => {
  const emptyUser = {
    username: null,
    token: null,
  };
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || emptyUser);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({
      username: userData.username,
      token: userData.token,
    });
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setUser(emptyUser);
  };

  const getAuthHeader = () => (user?.username && user?.token ? { Authorization: `Bearer ${user.token}` } : {});

  return (
    <authContext.Provider value={{
      logIn, logOut, getAuthHeader, user, setUser,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

const AuthButton = () => {
  const { user, logOut } = useAuth();
  const i18n = useTranslation();
  return user.username && user.token ? (
    <Button onClick={() => {
      logOut();
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
            <Navbar.Brand as={Link} to={routes.chatPagePath()}>Hexlet Chat</Navbar.Brand>
            <AuthButton />
          </Container>
        </Navbar>

        <Switch>
          <Route exact path={routes.loginPagePath()}>
            <LoginPage />
          </Route>
          <Route exact path={routes.signUpPagePath()}>
            <SignUpPage />
          </Route>
          <PrivateRoute exact path={routes.chatPagePath()}>
            <ChatPage />
          </PrivateRoute>
          <Route path={routes.notFoundPagePath()}>
            <NotFoundPage />
          </Route>
        </Switch>
      </Router>
    </div>
  </AuthProvider>
);
export default App;
