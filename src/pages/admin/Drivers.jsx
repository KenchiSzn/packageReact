import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

const Drivers = () => {
  const cookies = new Cookies();
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get(
          "http://localhost:5008/api/v1/users?role=driver",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setDrivers(response.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load drivers.");
      }
    };

    loadDrivers();
  }, []);

  const handleDelete = async (driver) => {
    const confirmed = window.confirm(
      `Delete ${driver.firstname} ${driver.lastname}? Existing packages will be kept and this driver will be unassigned.`,
    );
    if (!confirmed) return;

    setDeletingId(driver._id);
    setError("");
    try {
      const token = cookies.get("token");
      await axios.delete(`http://localhost:5008/api/v1/users/${driver._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDrivers((current) =>
        current.filter((item) => item._id !== driver._id),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete driver.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Drivers</h2>
          <p>View registered delivery drivers.</p>
        </div>
        <span className="page-status">{drivers.length} drivers</span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="page-panel">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>{driver._id}</td>
                  <td>
                    {driver.firstname} {driver.lastname}
                  </td>
                  <td>{driver.email}</td>
                  <td>{driver.phone || "Not provided"}</td>
                  <td>
                    <span className="page-status">{driver.role}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={deletingId === driver._id}
                      onClick={() => handleDelete(driver)}
                      aria-label={`Delete driver ${driver.firstname} ${driver.lastname}`}
                    >
                      {deletingId === driver._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!drivers.length && !error && (
          <div className="page-empty">No drivers to display.</div>
        )}
      </section>
    </div>
  );
};

export default Drivers;
