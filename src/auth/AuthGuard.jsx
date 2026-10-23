import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = ({ auth, role, children, redirectPath = "/login" }) => {
  if (!auth) {
    return <Navigate to={redirectPath} replace />;
  }

  let tokenRole;
  if (role) {
    try {
      tokenRole = jwtDecode(auth).role;
    } catch {
      return <Navigate to={redirectPath} replace />;
    }

    if (tokenRole !== role) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children || <Outlet />;
};
export default AuthGuard;