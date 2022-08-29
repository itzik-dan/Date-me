import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import Spinner from "../components/Spinner";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const year = new Date().getFullYear();
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();
  const { loggedIn, checkingStatus } = useAuth();

  // Redirect if user is logged in
  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  if (loading || checkingStatus) return <Spinner />;

  return (
    <div className="flex flex-col items-center justify-around min-h-screen">
      <h1 className="text-4xl">Welcome to Date Me!</h1>
      <img
        src="/images/date.jpeg"
        alt="logo"
        className="h-48 w-48 object-contain"
      />
      <OAuth setLoading={setLoading} />
      <footer>
        <p>Itzik Daniel ⓒ {year}</p>
      </footer>
    </div>
  );
};

export default Login;
