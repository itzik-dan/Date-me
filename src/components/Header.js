import { getAuth } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = ({ currentPic }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (path) => {
    return location.pathname === path;
  };

  const onLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 p-1 bg-gray-800">
      <div className="flex justify-between max-w-6xl mx-5 my-2 lg:mx-auto">
        {/* Logo */}
        <div className="cursor-pointer">
          <Link to="/">
            <img
              className="w-10 h-6 lg:w-16 lg:h-10 rounded-full"
              src="/images/date.jpeg"
              alt=""
            />
          </Link>
        </div>

        {/* Chat */}
        <div
          className={`cursor-pointer  ${
            pathMatchRoute("/profile") && "hidden"
          }`}
          title="Chat"
        >
          <Link to="/matches">
            <img
              className={`w-8 h-8 lg:w-10 lg:h-10 ${
                pathMatchRoute("/matches") && "animate-pulse duration-500"
              }`}
              src="/images/messages.png"
              alt=""
            />
          </Link>
        </div>

        {/* Profile */}
        <div className="cursor-pointer" title="Profile">
          <Link to="/profile">
            <img
              className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover ${
                pathMatchRoute("/profile") && "animate-pulse"
              }`}
              src={currentPic}
              alt=""
            />
          </Link>
        </div>

        {/* Logout */}
        <div className="cursor-pointer" onClick={onLogout} title="Logout">
          <img
            className="w-8 h-8 lg:w-10 lg:h-10"
            src="/images/logout_logo.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
