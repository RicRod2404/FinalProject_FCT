import { useSelector } from "react-redux";
import { sessionSelector } from "../store/session";
import { Navigate, Outlet } from "react-router-dom";
import usePrevious from "../hook/usePrevious";

interface ProtectedRouteProps {
  roles?: string[];
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const session = useSelector(sessionSelector);
  const previous = usePrevious(session);

  if (
    !session.isLogged &&
    previous === undefined && // Handle logout
    localStorage.getItem("token") === null // Handle refresh
  ) {
    return <Navigate to="/404" />;
  }

  if (
    props.roles &&
    props.roles.length !== 0 &&
    !props.roles.includes(session.role)
  ) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
