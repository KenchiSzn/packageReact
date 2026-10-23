import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

const MyPackages = () => {
  const cookies = new Cookies()
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPackages = async () => {
      try {
          const token = cookies.get("token");
                const response = await axios.get(
                  "http://localhost:5008/api/v1/packages/userpackages",
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,}},
                );

        setPackages(response.data.packages || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your packages.",
        );
      }
    };

    loadPackages();
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>My Packages</h2>
          <p>View the latest status and details of your shipments.</p>
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
                <th>Current Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.trackingNumber}</td>
                  <td>{pkg.origin}</td>
                  <td>{pkg.destination}</td>
                  <td>{pkg.currentLocation || "Not recorded"}</td>
                  <td>
                    <span className="page-status">
                      {pkg.status?.replaceAll("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!packages.length && !error && (
          <div className="page-empty">You have no packages yet.</div>
        )}
      </section>
    </div>
  );
};

export default MyPackages;
