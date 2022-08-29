import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth";

const MsgRoute = () => {
  const { loggedIn, checkingStatus } = useAuth();
  const { state } = useLocation();

  if (checkingStatus) {
    return <Spinner />;
  }

  // If user try to manually navigate through url address bar to /messages without being logged in or without selectig spesific screen, redirect to login page or matches screen accordingly
  return loggedIn ? (
    state ? (
      <Outlet />
    ) : (
      <Navigate to="/matches" />
    )
  ) : (
    <Navigate to="/login" />
  );
};

export default MsgRoute;
