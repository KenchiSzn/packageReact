import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import ModalComp from "../components/ModalComp";
import { useState } from "react";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();
  const cookies = new Cookies();

  let userLogin = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let response = await axios.post(
          "http://localhost:5008/api/v1/login",
          values,
        );
        const { token, role, ...user } = response.data.data;
        const dashboardByRole = {
          user: "/user/dashboard",
          admin: "/admin/dashboard",
          driver: "/driver/dashboard",
        };
        const dashboardPath = dashboardByRole[role];

        if (!dashboardPath) {
          alert("Unable to determine your account role.");
          return;
        }

        const decode = jwtDecode(token);
        cookies.set("token", token, {
          expires: new Date(decode.exp * 1000),
        });
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ ...user, role }));
        navigate(dashboardPath, { replace: true });
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema: yup.object({
      email: yup
        .string("Email must be a string")
        .required("Email is required")
        .email("Email is not valid"),
      password: yup
        .string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Invalid Password",
        ),
    }),
  });
  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100 py-5">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="login-card">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="login-icon">
                  <i className="bi bi-person-fill"></i>
                </div>
                <h2 className="login-title"> Welcome Back </h2>
                <p className="login-subtitle"> Login to your account </p>
              </div>
              {/* Form */}
              <form onSubmit={userLogin.handleSubmit}>
                {/* Email */}
                <div className="login-field">
                  <label className="login-label"> Email Address </label>
                  <div className="login-input-wrapper">
                    <i className="bi bi-envelope"></i>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={userLogin.values.email}
                      onChange={userLogin.handleChange}
                      onBlur={userLogin.handleBlur}
                      className={`login-input ${userLogin.touched.email && userLogin.errors.email ? "login-input-error" : ""}`}
                    />
                  </div>
                  {userLogin.touched.email && userLogin.errors.email ? (
                    <small className="login-error">
                      {userLogin.errors.email}
                    </small>
                  ) : null}
                </div>
                {/* Password */}
                <div className="login-field">
                  <label className="login-label"> Password </label>
                  <div className="login-input-wrapper">
                    <i className="bi bi-lock"></i>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={userLogin.values.password}
                      onChange={userLogin.handleChange}
                      onBlur={userLogin.handleBlur}
                      className={`login-input login-input--with-toggle ${userLogin.touched.password && userLogin.errors.password ? "login-input-error" : ""}`}
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
                  {userLogin.touched.password && userLogin.errors.password ? (
                    <small className="login-error">
                      {userLogin.errors.password}
                    </small>
                  ) : null}
                </div>
                {/* Forgot Password */}
                <div className="d-flex justify-content-end mb-4">
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() =>
                      navigate("/forgot-password", {
                        state: { email: userLogin.values.email },
                      })
                    }
                  >
                    Forgot Password?
                  </button>
                </div>
                {/* Login Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={userLogin.isSubmitting}
                    className="login-button"
                  >
                    {userLogin.isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login <i className="bi bi-arrow-right ms-2"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
              {/* Signup */}
              <div className="login-signup">
                <span> Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="signup-link"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalComp message={error} />
    </div>
  );
};
export default LoginPage;
