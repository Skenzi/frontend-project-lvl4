import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const LoginPage = () => {
  const auth = useAuth();
  const i18n = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [loginFailed, setLoginFailed] = useState(false);
  const loginSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
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
          localStorage.setItem('userId', JSON.stringify(token));
          localStorage.setItem('username', values.username);
          auth.logIn();
          auth.signUpClose();
          setSubmitting(false);
          const { from } = location.state || { from: { pathname: '/' } };
          history.replace(from);
        } catch (e) {
          setLoginFailed(true);
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
                    <h1 className="text-center mb-4">{i18n.t('login.logIn')}</h1>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="username">{i18n.t('username')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        id="username"
                        placeholder={i18n.t('nickname')}
                        onChange={handleChange}
                        isInvalid={loginFailed}
                        disabled={isSubmitting}
                        value={values.username}
                      />
                      {errors.username && touched.username ? (<p className="text-danger">{errors.username}</p>) : null}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="password">{i18n.t('password')}</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        id="password"
                        placeholder={i18n.t('password')}
                        onChange={handleChange}
                        isInvalid={loginFailed}
                        disabled={isSubmitting}
                        value={values.password}
                      />
                      {errors.password && touched.password ? (<p className="text-danger">{errors.password}</p>) : null}
                      <Form.Control.Feedback type="invalid">{i18n.t('errors.fillError')}</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {i18n.t('login.logIn')}
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
export default LoginPage;
