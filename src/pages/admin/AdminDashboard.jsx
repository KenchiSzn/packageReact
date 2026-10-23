import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import { Outlet, useLocation } from "react-router-dom";
import ModalComp from "../../components/ModalComp";

const ADMIN_STATUS_OPTIONS = [
  "select option",
  "order_created",
  "picked_up",
  "processing",
  "in_transit",
  "arrived_at_distribution_center",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const AdminDashboard = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => setIsOpen(false);
  const cookies = new Cookies();
  const [admin, setAdmin] = useState();
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");

  const getPackages = async () => {
    try {
      const token = cookies.get("token");
      const response = await axios.get("http://localhost:5008/api/v1/packages/allpackages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPackages(response.data.packages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load packages.");
    }
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get("http://localhost:5008/api/v1/getadmin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmin(response.data.data);
      } catch (error) {
        console.error("Unable to fetch admin:", error);
      }
    };

    const getCustomers = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get("http://localhost:5008/api/v1/users?role=user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCustomers(response.data.users || []);
      } catch (error) {
        console.error("Unable to fetch Customers:", error);
      }
    };


      const getDriver = async () => {
      try {
        const token = cookies.get("token");
        const response = await axios.get("http://localhost:5008/api/v1/users?role=driver", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCustomers(response.data.users || []);
      } catch (error) {
        console.error("Unable to fetch Customers:", error);
      }
    };

    getDriver()
    fetchAdmin();
    getCustomers();
    getPackages();

    const interval = setInterval(() => {
      getPackages();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (packageId, currentLocation, nextStatus) => {
    if (!nextStatus) return;

    try {
      const token = cookies.get("token");
      const response = await axios.patch(
        `http://localhost:5008/api/v1/packages/${packageId}/status`,
        {
          status: nextStatus,
          location: currentLocation || "Not recorded",
          description: `Package status updated to ${nextStatus.replaceAll("_", " ")}`,
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
      setError(err.response?.data?.message || "Unable to update package status.");
    }
  };

  const delivered = packages.filter((p) => p.status === "delivered").length;
  const transit = packages.filter((p) => p.status === "in_transit").length;
  const cancelled = packages.filter((p)=> p.status === "cancelled").length
  const pending = packages.filter(
    (p) => !["delivered", "cancelled"].includes(p.status),
  ).length;

  const isIndex = location.pathname === "/admin/dashboard";

  return (
    <div className="page-container">
      <AdminSidebar isOpen={isOpen} closeSidebar={closeSidebar} />

      {isIndex ? (
        <>
          <div className="page-heading">
            <div>
              <h2>Admin Dashboard</h2>
              <p>Monitor your package delivery operations.</p>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-3 mb-4">
            {[
              ["Total Packages", packages.length, "bi-box-seam"],
              ["Active Packages", pending, "bi-truck"],
              ["In Transit", transit, "bi-geo-alt"],
              ["Delivered", delivered, "bi-check-circle"],
              ["Cancelled", cancelled, "bi bi-x-circle"]
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
            <h5 className="mb-3">Recent Packages</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Package ID</th>
                    <th>Sender ID</th>
                    <th>Receiver ID</th>
                    <th>Driver ID</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.slice(0, 10).map((pkg) => (
                    <tr key={pkg._id}>
                      <td>{pkg.packageNumber}</td>
                      <td>{pkg.sender?._id || "—"}</td>
                      <td>{pkg.receiver?._id || "—"}</td>
                      <td>{pkg.assignedDriver?._id || "—"}</td>
                      <td>{pkg.origin}</td>
                      <td>{pkg.destination}</td>
                      <td>
                        <span className="page-status">{pkg.status?.replaceAll("_", " ")}</span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={pkg.status || "order_created"}
                          onChange={(e) => handleStatusUpdate(pkg._id, pkg.currentLocation, e.target.value)}
                        >
                          {ADMIN_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!packages.length && (
              <div className="page-empty">
                <i className="bi bi-inbox"></i>
                No packages found.
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

export default AdminDashboard;
