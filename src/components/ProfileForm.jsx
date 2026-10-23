import { useEffect, useState } from "react";
import api from "../services/api";

const ProfileForm = ({ endpoint, description }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(endpoint);
        setUser(response.data.data || {});
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [endpoint]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((current) => ({ ...current, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.patch("/update", {
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber || "",
      });
      setUser(response.data.user || user);
      setMessage(response.data.message || "Profile updated successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Profile update failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>My Profile</h2>
          <p>{description}</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <section className="page-panel">
        {loading ? (
          <div className="d-flex align-items-center gap-2" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            Loading profile...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="profile-firstname">
                  First name
                </label>
                <input
                  id="profile-firstname"
                  className="form-control"
                  name="firstname"
                  value={user.firstname || ""}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="profile-lastname">
                  Last name
                </label>
                <input
                  id="profile-lastname"
                  className="form-control"
                  name="lastname"
                  value={user.lastname || ""}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="profile-email">
                  Email
                </label>
                <input
                  id="profile-email"
                  className="form-control"
                  type="email"
                  value={user.email || ""}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="profile-phonenumber">
                  Phone
                </label>
                <input
                  id="profile-phonenumber"
                  className="form-control"
                  type="tel"
                  name="phonenumber"
                  value={user.phonenumber || ""}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default ProfileForm;
