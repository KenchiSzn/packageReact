import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as yup from "yup"

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost:5008/api/v1/reset-password/${token}`,
        { password },
      );
      setMessage(response.data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to reset your password right now. Please try again later.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100 py-5">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="login-card">
              <div className="text-center mb-4">
                <div className="login-icon">
                  <i className="bi bi-lock-fill" aria-hidden="true"></i>
                </div>
                <h2 className="login-title">Reset Password</h2>
                <p className="login-subtitle">Choose a new password</p>
              </div>
              {message ? (
                <>
                  <p className="text-success text-center" role="status">
                    {message}
                  </p>
                  <div className="d-grid">
                    <button
                      type="button"
                      className="login-button"
                      onClick={() => navigate("/login")}
                    >
                      Back to login
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="login-field">
                    <label className="login-label" htmlFor="new-password">
                      New Password
                     <div className="input-wrapper">
                      <i className="bi bi-lock"></i>
                       <input
                        id="new-password"
                        className="login-input"
                        type={showPassword ? "text" : "password"}
                        name="Enter new password"
                        required
                        minLength={8}
                        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                        title="Use at least 8 characters, including uppercase, lowercase, number and special character."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                      >
                        <i
                          className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                          aria-hidden="true"
                        ></i>
                      </button>
                     </div>
                    </label>
                  </div>

                  {/* confrim password */}
                  <div className="login-field">
                    <label className="login-label" htmlFor="confirm-password">
                      Confirm Password
                      <div className="input-wrapper">
                        <i className="bi bi-lock"></i>
                        <input
                          id="confirm-password"
                          className="login-input"
                          type={showConfirm ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
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
                    </label>
                  </div>
                  {error && (
                    <p className="login-error mb-3" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="login-button"
                      disabled={submitting}
                    >
                      {submitting ? "Updating..." : "Update password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
