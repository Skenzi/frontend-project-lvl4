import React, { useState } from 'react';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';
import { setUsername } from '../features/userSlice.js';

const LoginPage = () => {
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [loginFailed, setLoginFailed] = useState(false);
  const loginSchema = yup.object().shape({
    username: yup.string().required('Обязательно заполнить!'),
    password: yup.string().required('Обязательно заполнить!'),
  });
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setLoginFailed(false);
        try {
          const response = await axios.post(routes.loginPath(), values);
          const token = response.data;
          console.log(token, 'login');
          localStorage.setItem('userId', JSON.stringify(token));
          localStorage.setItem('username', values.username);
          auth.logIn();
          auth.signUpClose();
          setSubmitting(false);
          const { from } = location.state || { from: { pathname: '/' } };
          history.replace(from);
          dispatch(setUsername(values.username));
        } catch (e) {
          console.log(e);
          setLoginFailed(true);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => (
        <div className="container-fluid">
          <div className="row justify-content-center pt-5">
            <div className="col-sm-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="username">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter username"
                    onChange={handleChange}
                    isInvalid={loginFailed}
                    disabled={isSubmitting}
                    value={values.username}
                  />
                  {errors.username && touched.username ? (<p className="text-danger">{errors.username}</p>) : null}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={handleChange}
                    isInvalid={loginFailed}
                    disabled={isSubmitting}
                    value={values.password}
                  />
                  {errors.password && touched.password ? (<p className="text-danger">{errors.password}</p>) : null}
                </Form.Group>
                <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Log in
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};
export default LoginPage;
