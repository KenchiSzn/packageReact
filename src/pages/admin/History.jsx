import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const History = () => {
  const cookies = new Cookies();
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get(
          "http://localhost:5008/api/v1/packages/allpackages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setPackages(
          (response.data.packages || []).filter((pkg) =>
            ["delivered", "cancelled"].includes(pkg.status),
          ),
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load delivery history.",
        );
      }
    };

    loadHistory();
  }, []);

  const handleDelete = async (pkg) => {
    const confirmed = window.confirm(
      `Delete package ${pkg.trackingNumber} and all of its tracking history? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(pkg._id);
    setError("");
    try {
      const token = cookies.get("token");
      await axios.delete(`http://localhost:5008/api/v1/packages/${pkg._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPackages((current) => current.filter((item) => item._id !== pkg._id));
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete package history.",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Delivery History</h2>
          <p>Review delivered and cancelled packages.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="page-panel">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.trackingNumber}</td>
                  <td>{pkg.origin}</td>
                  <td>{pkg.destination}</td>
                  <td>
                    <span className="page-status">{pkg.status}</span>
                  </td>
                  <td>
                    {pkg.updatedAt
                      ? new Date(pkg.updatedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={deletingId === pkg._id}
                      onClick={() => handleDelete(pkg)}
                      aria-label={`Delete package ${pkg.trackingNumber} and its history`}
                    >
                      {deletingId === pkg._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!packages.length && !error && (
          <div className="page-empty">No completed deliveries yet.</div>
        )}
      </section>
    </div>
  );
};

export default History;
