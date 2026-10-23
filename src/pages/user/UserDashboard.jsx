// import { useEffect, useState } from "react";
// import axios from "axios"
// import { Outlet, useNavigate } from "react-router-dom";
// import Cookies from "universal-cookie";
// import UserSidebar from "../../components/UserSidebar";

// const UserDashboard = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const closeSidebar = () => setIsOpen(false)
//   const cookies = new Cookies()
//   const navigate = useNavigate()
//   const [user, setUser] = useState(null)
//   const [packages, setPackages] = useState([])

//   useEffect(() => {
//     const getCurrentUser = async () => {
//       try {
//         const token = cookies.get("token");
//         const response = await axios.get(
//           "http://localhost:5008/api/v1/getuser",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         setUser(response.data.data);

//       } catch (error) {

//         console.error("Unable to fetch the current user:", error);

//       }
//     };
//     getCurrentUser();

//   }, []);

//   return (
//     <div className="dashboard-page">

//       {/* Sidebar */}
//       <aside className="dashboard-sidebar">
//       <UserSidebar
//       isOpen={isOpen}
//       closeSidebar={closeSidebar}
//       />

//       </aside>
//       {/* Main Content */}
//       <main className="dashboard-main">
//         <Outlet />
//         {/* Topbar */}
//         <div className="dashboard-topbar">
//           <div>
//             <h3>Welcome Back,<span className="text-bold">{user?.firstname}</span>!</h3>
//             <p>Here's what's happening with your shipments today.</p>
//           </div>
//           <div className="dashboard-profile">
//             <button className="notification-btn">
//               <i className="bi bi-bell"></i>
//               <span></span>
//             </button>
//             <div className="profile-avatar">
//               {user?.firstname}
//             </div>
//             <div className="profile-details">
//               <strong>{user?.firstname}</strong>
//               <small>Customer</small>
//             </div>
//           </div>
//         </div>
//         {/* Quick Track */}
//         <div className="quick-track-card">
//           <div>
//             <span className="section-label">
//               TRACK YOUR PACKAGE
//             </span>
//             <h4>Where is your shipment?</h4>
//             <p>
//               Enter your tracking number to see the latest shipment status.
//             </p>
//           </div>
//           <div className="track-form">
//             <div className="track-input">
//               <i className="bi bi-search"></i>
//               <input
//                 type="text"
//                 placeholder="Enter tracking number"
//               />
//             </div>
//             <button className="track-button">
//               Track Package
//               <i className="bi bi-arrow-right"></i>
//             </button>
//           </div>
//         </div>
//         {/* Statistics */}
//         <div className="row g-4 mt-1">
//           <div className="col-12 col-sm-6 col-xl-3">
//             <div className="dashboard-stat-card">
//               <div className="stat-icon">
//                 <i className="bi bi-box-seam"></i>
//               </div>
//               <div>
//                 <span>Total Shipments</span>
//                 <h3>24</h3>
//                 <small className="stat-positive">
//                   <i className="bi bi-arrow-up"></i>
//                   12% this month
//                 </small>
//               </div>
//             </div>
//           </div>
//           <div className="col-12 col-sm-6 col-xl-3">
//             <div className="dashboard-stat-card">
//               <div className="stat-icon">
//                 <i className="bi bi-truck"></i>
//               </div>
//               <div>
//                 <span>In Transit</span>
//                 <h3>08</h3>
//                 <small>Currently moving</small>
//               </div>
//             </div>
//           </div>
//           <div className="col-12 col-sm-6 col-xl-3">
//             <div className="dashboard-stat-card">
//               <div className="stat-icon">
//                 <i className="bi bi-check-circle"></i>
//               </div>
//               <div>
//                 <span>Delivered</span>
//                 <h3>15</h3>
//                 <small className="stat-positive">
//                   94% delivery rate
//                 </small>
//               </div>
//             </div>
//           </div>

//           <div className="col-12 col-sm-6 col-xl-3">
//             <div className="dashboard-stat-card">

//               <div className="stat-icon">
//                 <i className="bi bi-hourglass-split"></i>
//               </div>

//               <div>
//                 <span>Pending</span>
//                 <h3>01</h3>
//                 <small>Awaiting dispatch</small>
//               </div>

//             </div>
//           </div>

//         </div>

//         {/* Recent Shipments */}
//         <div className="dashboard-section mt-4">

//           <div className="section-heading">

//             <div>
//               <h4>Recent Shipments</h4>
//               <p>Your latest package activity</p>
//             </div>

//             <button className="view-all-btn">
//               View All
//               <i className="bi bi-arrow-right"></i>
//             </button>

//           </div>

//           <div className="table-responsive">
//             <table className="dashboard-table">
//               <thead>
//                 <tr>
//                   <th>Tracking ID</th>
//                   <th>Destination</th>
//                   <th>Date</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>
//                     <strong>DEX-784291</strong>
//                   </td>
//                   <td>Lagos, Nigeria</td>
//                   <td>Sep 29, 2026</td>
//                   <td>
//                     <span className="status-badge status-transit">
//                       In Transit
//                     </span>
//                   </td>

//                   <td>
//                     <button className="table-action">
//                       Track
//                     </button>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <strong>DEX-583920</strong>
//                   </td>
//                   <td>Abuja, Nigeria</td>
//                   <td>Sep 27, 2026</td>
//                   <td>
//                     <span className="status-badge status-delivered">
//                       Delivered
//                     </span>
//                   </td>

//                   <td>
//                     <button className="table-action">
//                       Details
//                     </button>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>
//                     <strong>DEX-391827</strong>
//                   </td>
//                   <td>Port Harcourt, Nigeria</td>

//                   <td>Sep 25, 2026</td>
//                   <td>
//                     <span className="status-badge status-pending">
//                       Pending
//                     </span>
//                   </td>
//                   <td>
//                     <button className="table-action">
//                       Details
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         {/* Bottom Cards */}
//         <div className="row g-4 mt-1">
//           <div className="col-lg-7">
//             <div className="dashboard-section">
//               <div className="section-heading">
//                 <div>
//                   <h4>Shipment Activity</h4>
//                   <p>Recent updates on your packages</p>
//                 </div>
//               </div>
//               <div className="activity-list">

//                 <div className="activity-item">
//                   <div className="activity-icon">
//                     <i className="bi bi-truck"></i>
//                   </div>

//                   <div>
//                     <strong>Package dispatched</strong>
//                     <p>DEX-784291 has left the Lagos facility.</p>
//                     <small>2 hours ago</small>
//                   </div>
//                 </div>

//                 <div className="activity-item">
//                   <div className="activity-icon">
//                     <i className="bi bi-geo-alt"></i>
//                   </div>

//                   <div>
//                     <strong>Package arrived at facility</strong>
//                     <p>DEX-784291 arrived at the Ibadan hub.</p>
//                     <small>Yesterday</small>
//                   </div>
//                 </div>

//                 <div className="activity-item">
//                   <div className="activity-icon">
//                     <i className="bi bi-check-circle"></i>
//                   </div>

//                   <div>
//                     <strong>Package delivered</strong>
//                     <p>DEX-583920 was delivered successfully.</p>
//                     <small>2 days ago</small>
//                   </div>
//                 </div>

//               </div>

//             </div>

//           </div>

//           <div className="col-lg-5">

//             <div className="dashboard-section help-card">

//               <div className="help-icon">
//                 <i className="bi bi-headset"></i>
//               </div>

//               <h4>Need Help?</h4>

//               <p>
//                 Have a question about your shipment? Our support team
//                 is available to assist you.
//               </p>

//               <button className="support-button">
//                 Contact Support
//                 <i className="bi bi-arrow-right"></i>
//               </button>

//             </div>

//           </div>

//         </div>

//       </main>

//     </div>
//   );
// };

// export default UserDashboard;

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar";
import ModalComp from "../../components/ModalComp";
import api from "../../services/api";

const UserDashboard = () => {
  const cookies = new Cookies();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => setIsOpen(false);
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
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

        setUser(response.data.data);
      } catch (error) {
        console.error("Unable to fetch the current user:", error);
      }
    };

    const getUserPackages = async () => {
      try {
        const response = await api.get("/packages/userpackages");
        setPackages(response.data.packages || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your packages.",
        );
      }
    };

    getCurrentUser();
    getUserPackages();
  }, []);

  const delivered = packages.filter((p) => p.status === "delivered").length;
  const active = packages.filter(
    (p) => !["delivered", "cancelled"].includes(p.status),
  ).length;
  const isIndex = location.pathname === "/user/dashboard";

  return (
    <div className="page-container">
      <UserSidebar isOpen={isOpen} closeSidebar={closeSidebar} />

      {isIndex ? (
        <>
          <div className="page-heading">
            <div>
              <h2>Welcome, {user?.firstname || "Customer"}</h2>
              <p>Track your shipments and view delivery updates.</p>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-3 mb-4">
            {[
              ["My Packages", packages.length, "bi-box-seam"],
              ["Active Shipments", active, "bi-truck"],
              ["Delivered", delivered, "bi-check-circle"],
            ].map(([label, value, icon]) => (
              <div className="col-md-4" key={label}>
                <div className="page-stat">
                  <i className={`bi ${icon}`}></i>
                  <p className="mt-3">{label}</p>
                  <h3>{value}</h3>
                </div>
              </div>
            ))}
          </div>

          <section className="page-panel">
            <h5 className="mb-3">Recent Shipments</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tracking Number</th>
                    <th>Destination</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.slice(0, 5).map((p) => (
                    <tr key={p._id}>
                      <td>{p.trackingNumber}</td>
                      <td>{p.destination}</td>
                      <td>
                        <span className="page-status">
                          {p.status?.replaceAll("_", " ")}
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
        </>
      ) : (
        <Outlet />
      )}

      <ModalComp message={error} />
    </div>
  );
};

export default UserDashboard;
