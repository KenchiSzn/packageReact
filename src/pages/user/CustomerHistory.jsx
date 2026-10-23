import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios"


const CustomerHistory = () => {
  const cookies = new Cookies
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get(
          "http://localhost:5008/api/v1/getuser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPackages(response.data.data);
        // const response = await api.get("/packages/my-packages");
        // setPackages(
        //   (response.data.packages || []).filter(
        //   (p) => ["delivered", "cancelled"].includes(p.status)
        //   )
        // );
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load shipment history."
        );
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>Shipment History</h2>
          <p>Review completed and cancelled shipments.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="page-panel">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr><th>Tracking Number</th><th>Destination</th><th>Status</th><th>Last Updated</th></tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p._id}>
                  <td>{p.trackingNumber}</td>
                  <td>{p.destination}</td>
                  <td><span className="page-status">{p.status}</span></td>
                  <td>{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!packages.length && !error && (
          <div className="page-empty">No shipment history yet.</div>
        )}
      </section>
    </div>
  );
};

export default CustomerHistory;