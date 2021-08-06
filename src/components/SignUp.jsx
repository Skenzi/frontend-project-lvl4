import React, { useState } from 'react';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const SignUpPage = () => {
  const [userExist, setSignUp] = useState(false);
  const isUserExist = () => setSignUp(true);
  const isUserNotExist = () => setSignUp(false);
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const signUpSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
    repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  });
  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        repeatPassword: '',
      }}
      validationSchema={signUpSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(routes.signUpPath(), values);
          const token = response.data;
          localStorage.setItem('userId', JSON.stringify(token));
          localStorage.setItem('username', token.username);
          auth.logIn();
          auth.signUpClose();
          isUserNotExist();
          setSubmitting(false);
          const { from } = location.state || { from: { pathname: '/' } };
          history.replace(from);
        } catch (e) {
          console.log(e);
          isUserExist();
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
                    isInvalid={userExist}
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
                    isInvalid={userExist}
                    disabled={isSubmitting}
                    value={values.password}
                  />
                  {errors.password && touched.password ? (<p className="text-danger">{errors.password}</p>) : null}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="repeatPassword">Repeat Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="repeatPassword"
                    id="repeatPassword"
                    placeholder="Repeat Password"
                    onChange={handleChange}
                    isInvalid={userExist || values.repeatPassword !== values.password}
                    disabled={isSubmitting}
                    value={values.repeatPassword}
                  />
                  {(errors.repeatPassword && touched.repeatPassword) ? (<p className="text-danger">{errors.repeatPassword}</p>) : null}
                </Form.Group>
                <Form.Control.Feedback type="invalid">this user is exist</Form.Control.Feedback>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Sign Up
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignUpPage;
