import { Navigate, Outlet } from "react-router-dom";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth";

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuth();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
