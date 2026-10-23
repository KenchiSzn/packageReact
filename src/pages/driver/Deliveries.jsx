import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

const Deliveries = () => {
  const cookies = new Cookies();
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get(
          "http://localhost:5008/api/v1/packages/driverpackages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPackages(
          (response.data.packages || []).filter((p) =>
            ["delivered", "cancelled"].includes(p.status),
          ),
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load delivery history.",
        );
      }
    };

    loadDeliveries();
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Delivery History</h2>
          <p>Review your completed and cancelled deliveries.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="page-panel">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Destination</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p._id}>
                  <td>{p.trackingNumber}</td>
                  <td>{p.destination}</td>
                  <td>{p.currentLocation || "Not recorded"}</td>
                  <td>
                    <span className="page-status">{p.status}</span>
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

export default Deliveries;
