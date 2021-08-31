import React, { useState } from 'react';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import useAuth from '../hooks/index.js';

const SignUpPage = () => {
  const [userExist, setSignUp] = useState(false);
  const isUserExist = () => setSignUp(true);
  const isUserNotExist = () => setSignUp(false);
  const auth = useAuth();
  const i18n = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const signUpSchema = yup.object().shape({
    username: yup.string().min(3).required(),
    password: yup.string().min(6).max(20).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], i18n.t('errors.confirmPasswords')),
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
          isUserExist();
          if (e.isAxiosError) {
            console.log(e);
          } else {
            console.log(e);
          }
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
                    <h1 className="text-center mb-4">{i18n.t('signup.register')}</h1>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="username">{i18n.t('username')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        id="username"
                        placeholder={i18n.t('username')}
                        onChange={handleChange}
                        isInvalid={userExist}
                        disabled={isSubmitting}
                        value={values.username}
                      />
                      {errors.username && touched.username ? (<p className="text-danger">{i18n.t('errors.usernameCountSymbols')}</p>) : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="password">{i18n.t('password')}</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        id="password"
                        placeholder={i18n.t('password')}
                        onChange={handleChange}
                        isInvalid={userExist}
                        disabled={isSubmitting}
                        value={values.password}
                      />
                      {errors.password && touched.password ? (<p className="text-danger">{i18n.t('errors.passwordCountSymbols')}</p>) : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="confirmPassword">{i18n.t('signup.confirmPassword')}</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder={i18n.t('password')}
                        onChange={handleChange}
                        isInvalid={userExist}
                        disabled={isSubmitting}
                        value={values.confirmPassword}
                      />
                      {(errors.confirmPassword && touched.confirmPassword) ? (<p className="text-danger">{errors.confirmPassword}</p>) : null}
                      {userExist ? (<Form.Control.Feedback type="invalid">{i18n.t('errors.userExist')}</Form.Control.Feedback>) : null}
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {i18n.t('signup.signUp')}
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
