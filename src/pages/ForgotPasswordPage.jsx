import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5008/api/v1/forgot-password",
        { email },
      );
      setMessage(response.data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to send a reset link right now. Please try again later.",
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
                  <i className="bi bi-envelope" aria-hidden="true"></i>
                </div>
                <h2 className="login-title">Forgot Password?</h2>
                <p className="login-subtitle">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="login-field">
                  <label className="login-label" htmlFor="forgot-email">
                    Email Address
                    <div className="input-wrapper">
                      <i className="bi bi-envelope"></i>
                        <input
                    id="forgot-email"
                    className="login-input"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                    </div>
                  </label>
                
                </div>
                {message && (
                  <p className="text-success mb-3" role="status">
                    {message}
                  </p>
                )}
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
                    {submitting ? "Sending..." : "Send reset link"}
                  </button>
                </div>
              </form>
              <div className="login-signup">
                <button
                  type="button"
                  className="signup-link"
                  onClick={() => navigate("/login")}
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
