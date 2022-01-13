import { Navigate, Outlet } from "react-router-dom";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth";

const LoginRoute = () => {
  const { loggedIn, checkingStatus } = useAuth();

  if (checkingStatus) {
    return <Spinner />;
  }

  return !loggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default LoginRoute;
