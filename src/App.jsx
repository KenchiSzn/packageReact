import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/user/UserDashboard";
import Cookies from "universal-cookie";
import AuthGuard from "./auth/AuthGuard";
import CreatePackage from "./pages/admin/CreatePackage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import Footer from "./components/Footer";
import UserSettings from "./pages/user/UserSettings";
import Deliveries from "./pages/driver/Deliveries";
import MyProfile from "./pages/driver/MyProfile";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminHistory from "./pages/admin/History";
import Settings from "./pages/driver/Settings";
import DriverNotifications from "./pages/driver/Notifications";
import Notifications from "./pages/user/Notifications";
import AdminProfile from "./pages/admin/AdminProfile";
import Customers from "./pages/admin/Customers";
import Drivers from "./pages/admin/Drivers";
import AdminNotifications from "./pages/admin/AdminNotifications";
import UserProfile from "./pages/user/UserProfile";
import CustomerHistory from "./pages/user/CustomerHistory";
import MyPackages from "./pages/user/MyPackages";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const App = () => {
  const location = useLocation();
  const cookies = new Cookies();
  const token = cookies.get("token");

  const hideNavbar = [
    // user
    "/user/dashboard",
    "/user/dashboard/history",
    "/user/dashboard/packages",
    "/user/dashboard/notification",
    "/user/dashboard/profile",
    "/user/dashboard/settings",
    // driver
    "/driver/dashboard",
    "/driver/dashboard/deliveryhistory",
    "/driver/dashboard/notifications",
    "/driver/dashboard/profile",
    "/driver/dashboard/settings",
    // admin
    "/admin/dashboard",
    "/admin/dashboard/createpackage",
    "/admin/dashboard/customers",
    "/admin/dashboard/drivers",
    "/admin/dashboard/deliveryhistory",
    "/admin/dashboard/notifications",
    "/admin/dashboard/profile",
    "/admin/dashboard/adminsettings",
  ];

  const hideFooter = [
    "/signup",
    "/login",
    "/forgot-password",
    // admin
    "/admin/dashboard",
    "/admin/dashboard/createpackage",
    "/admin/dashboard/customers",
    "/admin/dashboard/drivers",
    "/admin/dashboard/deliveryhistory",
    "/admin/dashboard/notifications",
    "/admin/dashboard/profile",
    "/admin/dashboard/adminsettings",
    // user
    "/user/dashboard",
    "/user/dashboard/packages",
    "/user/dashboard/history",
    "/user/dashboard/notification",
    "/user/dashboard/profile",
    "/user/dashboard/settings",
    // driver
    "/driver/dashboard",
    "/driver/dashboard/deliveryhistory",
    "/driver/dashboard/notifications",
    "/driver/dashboard/profile",
    "/driver/dashboard/settings",
  ];

  return (
    <>
      {!hideNavbar.includes(location.pathname) &&
        !location.pathname.startsWith("/reset-password/") && <Navbar />}
      <Routes location={location}>
        <Route index element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* User */}
        <Route element={<AuthGuard auth={token} role="user" />}>
          <Route path="/user/dashboard" element={<UserDashboard />}>
            <Route path="packages" element={<MyPackages />} />
            <Route path="history" element={<CustomerHistory />} />
            <Route path="notification" element={<Notifications />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<AuthGuard auth={token} role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route path="createpackage" element={<CreatePackage />} />
            <Route path="customers" element={<Customers />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="deliveryhistory" element={<AdminHistory />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="adminsettings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Driver */}
        <Route element={<AuthGuard auth={token} role="driver" />}>
          <Route path="/driver/dashboard" element={<DriverDashboard />}>
            <Route path="deliveryhistory" element={<Deliveries />} />
            <Route path="notifications" element={<DriverNotifications />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
      {!hideFooter.includes(location.pathname) &&
        !location.pathname.startsWith("/reset-password/") && <Footer />}
    </>
  );
};
export default App;
