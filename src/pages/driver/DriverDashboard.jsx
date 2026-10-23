import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import ModalComp from "../../components/ModalComp";
import { Outlet, useLocation } from "react-router-dom";
import DriverSidebar from "../../components/DriverSidebar";

const DRIVER_SEQUENCE = [
  "picked_up",
  "in_transit",
  "delivered",
];

const DriverDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => setIsOpen(false);
  const location = useLocation();
  const cookies = new Cookies();
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const loadDeliveries = async () => {
    try {
      const token = cookies.get("token");
      const response = await axios.get("http://localhost:5008/api/v1/packages/driverpackages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data.packages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load assigned deliveries.");
    }
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get("http://localhost:5008/api/v1/getdriver", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.data);
      } catch (error) {
        console.error("Unable to fetch Driver:", error);
      }
    };

    fetchDriver();
    loadDeliveries();

    const interval = setInterval(() => {
      loadDeliveries();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (packageId, currentLocation, currentStatus) => {
    const currentIndex = DRIVER_SEQUENCE.indexOf(currentStatus);
    const nextStatus = DRIVER_SEQUENCE[currentIndex + 1];

    if (!nextStatus || nextStatus === "delivered" || currentStatus === "delivered" || currentStatus === "cancelled") {
      return;
    }

    try {
      const token = cookies.get("token");
      const response = await axios.patch(
        `http://localhost:5008/api/v1/packages/${packageId}/status`,
        {
          status: nextStatus,
          location: currentLocation || "Not recorded",
          description: `Driver updated package status to ${nextStatus.replaceAll("_", " ")}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setPackages((prev) =>
        prev.map((pkg) =>
          pkg._id === packageId
            ? { ...pkg, status: response.data.package?.status || nextStatus, currentLocation: response.data.package?.currentLocation || currentLocation }
            : pkg,
        ),
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update delivery status.");
    }
  };

  const active = packages.filter(
    (p) => !["delivered", "cancelled"].includes(p.status),
  ).length;

  const delivered = packages.filter((p) => p.status === "delivered").length;

  const outForDelivery = packages.filter(
    (p) => p.status === "out_for_delivery",
  ).length;

  const isIndex = location.pathname === "/driver/dashboard";

  return (
    <div className="page-container">
      <DriverSidebar isOpen={isOpen} closeSidebar={closeSidebar} />

      {isIndex ? (
        <>
          <div className="page-heading">
            <div>
              <h2>Welcome, {user?.firstname || "Driver"}</h2>
              <p>Manage assigned deliveries and update shipment progress.</p>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-3 mb-4">
            {[
              ["Assigned Packages", packages.length, "bi-box-seam"],
              ["Active Deliveries", active, "bi-truck"],
              ["Out for Delivery", outForDelivery, "bi-geo-alt"],
              ["Delivered", delivered, "bi-check-circle"],
            ].map(([label, value, icon]) => (
              <div className="col-12 col-sm-6 col-xl-3" key={label}>
                <div className="page-stat">
                  <i className={`bi ${icon}`}></i>
                  <p className="mt-3">{label}</p>
                  <h3>{value}</h3>
                </div>
              </div>
            ))}
          </div>

          <section className="page-panel">
            <h5 className="mb-3">Assigned Deliveries</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tracking Number</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Current Location</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((p) => {
                    const nextStatus = DRIVER_SEQUENCE[DRIVER_SEQUENCE.indexOf(p.status) + 1];
                    const canAdvance = !!nextStatus && !["delivered", "cancelled"].includes(p.status);

                    return (
                      <tr key={p._id}>
                        <td>{p.trackingNumber}</td>
                        <td>{p.origin}</td>
                        <td>{p.destination}</td>
                        <td>{p.currentLocation || "Not recorded"}</td>
                        <td>
                          <span className="page-status">{p.status?.replaceAll("_", " ")}</span>
                        </td>
                        <td>
                          {canAdvance ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => handleStatusUpdate(p._id, p.currentLocation, p.status)}
                            >
                              Move to {nextStatus.replaceAll("_", " ")}
                            </button>
                          ) : (
                            <span className="text-muted">No action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!packages.length && !error && (
              <div className="page-empty">
                <i className="bi bi-truck"></i>
                <h5>No assigned deliveries</h5>
                <p>Packages assigned to you will appear here.</p>
              </div>
            )}
          </section>
        </>
      ) : (
        <Outlet />
      )}

      <ModalComp message={error} />
    </div>
  );
};

export default DriverDashboard;
