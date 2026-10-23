
import { NavLink } from "react-router-dom";

const UserSidebar = ({ isOpen, closeSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: "bi-grid" },
    { name: "My Packages", path: "/user/dashboard/packages", icon: "bi-box-seam" },
    // { name: "Shipment History", path: "/user/dashboard/history", icon: "bi-clock-history" },
    // { name: "Notifications", path: "/user/dashboard/notification", icon: "bi-bell" },
    { name: "My Profile", path: "/user/dashboard/profile", icon: "bi-person" },
    // { name: "Settings", path: "/user/dashboard/settings", icon: "bi-gear" },
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

        {/* <div className="sidebar-user">
          <div className="user-avatar">
            <i className="bi bi-person-fill" />
          </div>

          <div>
            <h6>Welcome Back!</h6>
            <small>User Dashboard</small>
          </div>
        </div> */}

        <p className="sidebar-heading mt-4">MAIN MENU</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/user/dashboard"}
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

export default UserSidebar;