import React, { useState } from 'react';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const SignUpPage = () => {
  const [userExist, setSignUp] = useState(false);
  const isUserExist = () => setSignUp(true);
  const isUserNotExist = () => setSignUp(false);
  const auth = useAuth();
  const i18n = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const signUpSchema = yup.object().shape({
    username: yup.string().min(3).max(30).required(),
    password: yup.string().min(6).max(40).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  });
  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
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
              <div className="card shadow-sm">
                <div className="card-body">
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
                      <Form.Label htmlFor="repeatPassword">Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        isInvalid={userExist}
                        disabled={isSubmitting}
                        value={values.repeatPassword}
                      />
                      {(errors.repeatPassword && touched.repeatPassword) ? (<p className="text-danger">{errors.repeatPassword}</p>) : null}
                      <Form.Control.Feedback type="invalid">{i18n.t('signup.userExist')}</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      Sign Up
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignUpPage;
