import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "./AdminLogin.module.css"; // Import the same CSS module
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const EmployeeRegister = () => {
  const navigate = useNavigate();

  const routeEmployeeLogin = () => {
    navigate('/employeelogin');
  };

  const initialValues = {
    name: "",
    email: "",
    password: "",
    number: "",
    designation: "", 
    department: "", 
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    number: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits") 
      .required("Phone number is required"),
    designation: Yup.string().required("Designation is required"), 
    department: Yup.string().required("Department is required"), 
  });
  const onSubmit = async (values, { setSubmitting }) => {
    console.log(values); 
    try {
      const response = await axios.post("http://localhost:8000/employee/register", {
        name: values.name,
        email: values.email,
        number: values.number,
        password: values.password,
        designation: values.designation,  
        department: values.department,    
      });
  
      if (response.status === 200) {
        alert("Registration successful!");
        navigate("/employeelogin");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
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
        onSubmit={onSubmit}
        validateOnBlur={false} 
        validateOnChange={false} 
      >
        {({ isSubmitting }) => (
          <Form className={`${style.formPosition}`}>
            <span className={`${style.spanAdmin}`}>Employee</span>
            <dl className={`bg-white ${style.dataList}`} id={`${style.formPadding}`}>
              
              <dt className={`${style.dataList}`}>
                <label htmlFor="name" className={`form-label ${style.dataList}`}>
                  Name
                </label>
              </dt>
              <dd className={`${style.dataList}`}>
                <Field
                  name="name"
                  type="text"
                  className={`form-control p-2 w-100 ${style.dataList}`}
                  placeholder="Enter your name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={`error text-danger ${style.dataList}`}
                />
              </dd>

             
              <dt className={`${style.dataList}`}>
                <label htmlFor="email" className={`form-label ${style.dataList}`}>
                  Email
                </label>
              </dt>
              <dd className={`${style.dataList}`}>
                <Field
                  name="email"
                  type="email"
                  className={`form-control p-2 w-100 ${style.dataList}`}
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={`error text-danger ${style.dataList}`}
                />
              </dd>

             
              <dt className={`${style.dataList}`}>
                <label htmlFor="password" className={`form-label ${style.dataList}`}>
                  Password
                </label>
              </dt>
              <dd className={`${style.dataList}`}>
                <Field
                  name="password"
                  type="password"
                  className={`form-control p-2 w-100 ${style.dataList}`}
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={`error text-danger ${style.dataList}`}
                />
              </dd>

              <dt className={`${style.dataList}`}>
                <label htmlFor="number" className={`form-label ${style.dataList}`}>
                  Phone Number
                </label>
              </dt>
              <dd className={`${style.dataList}`}>
                <Field
                  name="number"
                  type="text"
                  className={`form-control p-2 w-100 ${style.dataList}`}
                  placeholder="Enter your phone number"
                />
                <ErrorMessage
                  name="number"
                  component="div"
                  className={`error text-danger ${style.dataList}`}
                />
              </dd>

              <dt className={`${style.dataList}`}>
                <label htmlFor="designation" className={`form-label ${style.dataList}`}>
                  Designation
                </label>
              </dt>
              <dd className={`${style.dataList}`}>
                <Field
                  name="designation"
                  type="text"
                  className={`form-control p-2 w-100 ${style.dataList}`}
                  placeholder="Enter your designation"
                />
                <ErrorMessage
                  name="designation"
                  component="div"
                  className={`error text-danger ${style.dataList}`}
                />
              </dd>

              <dt className={`${style.dataList}`}>
                <label htmlFor="department" className={`form-label ${style.dataList}`}>
                  Department
                </label>
              </dt>
              <dd className={`${style.dataList}`}>
                <Field
                  name="department"
                  type="text"
                  className={`form-control p-2 w-100 ${style.dataList}`}
                  placeholder="Enter your department"
                />
                <ErrorMessage
                  name="department"
                  component="div"
                  className={`error text-danger ${style.dataList}`}
                />
              </dd>

              <button
                type="submit"
                className={`${style.pdBtn}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Register"}
              </button>

              <button className={`${style.pdBtn}`} onClick={routeEmployeeLogin}>
                Already have an account?
              </button>
            </dl>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EmployeeRegister;
