
import { NavLink } from "react-router-dom";

const DriverSidebar = ({ isOpen, closeSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/driver/dashboard", icon: "bi-grid" },
    { name: "Delivery History", path: "/driver/dashboard/deliveryhistory", icon: "bi-clock-history" },
    // { name: "Notifications", path: "/driver/dashboard/notifications", icon: "bi-bell" },
    { name: "My Profile", path: "/driver/dashboard/profile", icon: "bi-person" },
    // { name: "Settings", path: "/driver/dashboard/settings", icon: "bi-gear" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`dashboard-sidebar ${isOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <i className="bi bi-box-seam-fill" />
          <span>Delivery Express</span>
        </div>

        {/* <div className="sidebar-driver">
          <div className="driver-avatar">
            <i className="bi bi-person-fill" />
          </div>

          <div>
            <h6>Welcome Back!</h6>
            <small>Driver Dashboard</small>
          </div>
        </div> */}

        <p className="sidebar-heading mt-4">MAIN MENU</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/driver/dashboard"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {/* <NavLink
            to="/"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <i className="bi bi-house" />
            <span>Back to Website</span>
          </NavLink> */}

          <NavLink
            to="/"
            className="sidebar-link logout-link"
            onClick={closeSidebar}
          >
            <i className="bi bi-box-arrow-right" />
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default DriverSidebar;