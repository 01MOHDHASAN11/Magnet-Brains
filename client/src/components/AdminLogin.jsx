import React from 'react';
import style from "./AdminLogin.module.css"
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const AdmitLogin = () => {
  const navigate = useNavigate()
  const initialValues = {
    adminEmail: '',
    adminPassword: '',
  };

  const validationSchema = Yup.object().shape({
    adminEmail: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    adminPassword: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:8000/admin/login', {
        Email: values.adminEmail,
        Password: values.adminPassword,
      });

      if (response.status === 200) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/main');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        console.error(error);
        alert('Something went wrong. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={`${style.formPosition}`}>
            <span className={`${style.spanAdmin}`}>Admin Login Page</span>
            <dl className={`bg-white ${style.dataList}`} id={`${style.formPadding}`}>
              <dt className={`${style.dataList}`}>
                <label htmlFor="email" className={`form-label ${style.dataList}`}>Email</label>
              </dt>
              <dd className={`${style.dataList}`}>
                <Field name="adminEmail" type="email" className={`form-control p-2 w-100 ${style.dataList}`}/>
                <ErrorMessage name="adminEmail" component="div" className={`error text-danger ${style.dataList}`} />
              </dd>

              <dt className={`${style.dataList}`}>
                <label htmlFor="password" className={`form-label ${style.dataList}`}>Password</label>
              </dt>
              <dd className={`${style.dataList}`}>
                <Field name="adminPassword" type="password" className={`form-control w-100 p-2 ${style.dataList}`}/>
                <ErrorMessage name="adminPassword" component="div" className={`error text-danger ${style.dataList}`} />
              </dd>
              <button type="submit" className={`${style.pdBtn}`} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            </dl>
            
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AdmitLogin;