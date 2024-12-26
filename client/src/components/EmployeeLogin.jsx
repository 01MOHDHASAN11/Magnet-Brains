import React from 'react';
import style from './EmployeeLogin.module.css';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeLogin = () => {
  const navigate = useNavigate();

  const initialValues = {
    employeeEmail: '',
    employeePassword: '',
  };

  const validationSchema = Yup.object().shape({
    employeeEmail: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    employeePassword: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Submitting login request with:", values);
      const response = await axios.post('http://localhost:8000/employee/login', {
        email: values.employeeEmail,  
        password: values.employeePassword,  
      });
  
      console.log("Response from server:", response);
  
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem('employeeToken', token);
        localStorage.setItem('employeeName', user.name);
        navigate('/employeeMainPage');
      }
    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data);
        alert(error.response?.data?.message || 'Login failed. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Server not responding. Please try again later.');
      } else {
        console.error('Error:', error.message);
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  
  

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={style.formPosition}>
          <span className={style.spanAdmin}>Employee Login</span>
          <dl className={`bg-white ${style.dataList}`} id={style.formPadding}>
            <dt>
              <label htmlFor="email" className="form-label">Email</label>
            </dt>
            <dd>
              <Field name="employeeEmail" type="email" className="form-control p-2 w-100" />
              <ErrorMessage name="employeeEmail" component="div" className="error text-danger" />
            </dd>
            <dt>
              <label htmlFor="password" className="form-label">Password</label>
            </dt>
            <dd>
              <Field name="employeePassword" type="password" className="form-control w-100 p-2" />
              <ErrorMessage name="employeePassword" component="div" className="error text-danger" />
            </dd>
            <button type="submit" className={style.pdBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </dl>
        </Form>
      )}
    </Formik>
  );
};

export default EmployeeLogin;
