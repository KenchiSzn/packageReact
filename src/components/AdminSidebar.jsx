
import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = ({ isOpen, closeSidebar }) => {
    const navigate = useNavigate()
    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "bi-grid" },
        { name: "Create Delivery", path: "/admin/dashboard/createpackage", icon: "bi bi-box" },
        { name: "Customers", path: "/admin/dashboard/customers", icon: "bi bi-people" },
        { name: "Drivers", path: "/admin/dashboard/drivers", icon: "bi bi-truck" },
        { name: "Delivery History", path: "/admin/dashboard/deliveryhistory", icon: "bi-clock-history" },
        // { name: "Notifications", path: "/admin/dashboard/notifications", icon: "bi-bell" },
        { name: "My Profile", path: "/admin/dashboard/profile", icon: "bi-person" },
        // { name: "Settings", path: "/admin/dashboard/adminsettings", icon: "bi-gear" },
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
{/* 
                <div className="sidebar-admin">
                    <div className="admin-avatar">
                        <i className="bi bi-person-fill" />
                    </div>

                    <div>
                        <h6>Welcome Back!</h6>
                        <small>admin Dashboard</small>
                    </div>
                </div> */}

                <p className="sidebar-heading mt-4">MAIN MENU</p>

                <nav className="sidebar-menu">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin/dashboard"}
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

                    <button
                        type="button"
                        className="sidebar-link logout-link"
                        onClick={()=>{
                            closeSidebar();
                            navigate("/")
                        }}>
                        <i className="bi bi-box-arrow-right" />
                        <span>Logout</span>

                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;