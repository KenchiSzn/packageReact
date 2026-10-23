import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

const SignupPage = () => {
  const cookies = new Cookies();
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  let userSignup = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          "http://localhost:5008/api/v1/register",
          values,
        );

        console.log("the response", response);
        console.log("the response.data", response.data);
        console.log("the response.data.message", response.data.message);

        // Token

        const decode = jwtDecode(response.data.data.token);
        const expiryTime = new Date(decode.exp * 1000);
        cookies.set("token", response.data.data.token, { expires: expiryTime });

        if (response.status === 201) {
          navigate("/user/dashboard");
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.log(error.response.data.message);
        }
      } finally {
        setSubmitting(false);
      }
    },

    validationSchema: yup.object({
      firstname: yup
        .string("First name must be a string")
        .required("First name is required")
        .min(3, "First name must be at least 3 characters"),
      lastname: yup
        .string("Last name must be a string")
        .required("Last Name is required")
        .min(3, "Last name must be at least 3 characters"),
      email: yup
        .string("Email must be a string")
        .required("Email is required")
        .email("Email is not valid"),
      password: yup
        .string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain uppercase, lowercase, number and special character",
        ),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
  });

  return (
    <div className="signup-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100 py-5">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="signup-card">
              <div className="text-center mb-4">
                <div className="signup-icon">
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h2 className="signup-title"> Create Account </h2>
                <p className="signup-subtitle">
                  Fill in your details to get started
                </p>
              </div>
              <form onSubmit={userSignup.handleSubmit}>
                {/* firstname */}
                <div className="signup-field">
                  <label className="signup-label"> First Name </label>
                  <div className="input-wrapper">
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      name="firstname"
                      value={userSignup.values.firstname}
                      placeholder="Enter your first name"
                      onChange={userSignup.handleChange}
                      onBlur={userSignup.handleBlur}
                      className={`signup-input ${userSignup.touched.firstname && userSignup.errors.firstname ? "input-error" : ""}`}
                    />
                  </div>
                  {userSignup.touched.firstname &&
                  userSignup.errors.firstname ? (
                    <small className="signup-error">
                      {userSignup.errors.firstname}
                    </small>
                  ) : null}
                </div>
                {/* lastname */}
                <div className="signup-field">
                  <label className="signup-label"> Last Name </label>
                  <div className="input-wrapper">
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      name="lastname"
                      value={userSignup.values.lastname}
                      placeholder="Enter your last name"
                      onChange={userSignup.handleChange}
                      onBlur={userSignup.handleBlur}
                      className={`signup-input ${userSignup.touched.lastname && userSignup.errors.lastname ? "input-error" : ""}`}
                    />
                  </div>
                  {userSignup.touched.lastname && userSignup.errors.lastname ? (
                    <small className="signup-error">
                      {userSignup.errors.lastname}
                    </small>
                  ) : null}
                </div>
                {/* email-address */}
                <div className="signup-field">
                  <label className="signup-label"> Email Address </label>
                  <div className="input-wrapper">
                    <i className="bi bi-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      value={userSignup.values.email}
                      placeholder="Enter your email"
                      onChange={userSignup.handleChange}
                      onBlur={userSignup.handleBlur}
                      className={`signup-input ${userSignup.touched.email && userSignup.errors.email ? "input-error" : ""}`}
                    />
                  </div>
                  {userSignup.touched.email && userSignup.errors.email ? (
                    <small className="signup-error">
                      {userSignup.errors.email}
                    </small>
                  ) : null}
                </div>
                {/* password */}
                <div className="signup-field">
                  <label className="signup-label"> Password </label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={userSignup.values.password}
                      placeholder="Enter your password"
                      onChange={userSignup.handleChange}
                      onBlur={userSignup.handleBlur}
                      className={`signup-input signup-input--with-toggle ${userSignup.touched.password && userSignup.errors.password ? "input-error" : ""}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                  {userSignup.touched.password && userSignup.errors.password ? (
                    <small className="signup-error">
                      {userSignup.errors.password}
                    </small>
                  ) : null}
                </div>


                {/* confirm password */}
                <div className="signup-field">
                  <label className="signup-label"> Confirm Password </label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock"></i>
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={userSignup.values.confirmPassword}
                      placeholder="Confirm your password"
                      onChange={userSignup.handleChange}
                      onBlur={userSignup.handleBlur}
                      className={`signup-input signup-input--with-toggle ${userSignup.touched.confirmPassword && userSignup.errors.confirmPassword ? "input-error" : ""}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirm((visible) => !visible)}
                      aria-label={
                        showConfirm
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      aria-pressed={showConfirm}
                    >
                      <i
                        className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                  {userSignup.touched.confirmPassword &&
                  userSignup.errors.confirmPassword ? (
                    <small className="signup-error">
                      {userSignup.errors.confirmPassword}
                    </small>
                  ) : null}
                </div>
                {/* Submit */}
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    disabled={userSignup.isSubmitting}
                    className="signup-button"
                  >
                    {userSignup.isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <i className="bi bi-arrow-right ms-2"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
              <div className="signup-login">
                <span> Already have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="login-link"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;
