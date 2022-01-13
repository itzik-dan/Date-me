import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 p-2">
      <div className="flex justify-between max-w-6xl mx-5 my-5 lg:mx-auto">
        {/* Logo */}
        <div className="lg:inline-flex cursor-pointer">
          <Link to="/">
            <img
              className="w-12 h-8 lg:w-20 lg:h-12 rounded-full"
              src="/images/date.jpeg"
              alt=""
            />
          </Link>
        </div>

        {/* Chat */}
        <div className="cursor-pointer" title="Chat">
          <img
            className="w-8 h-8 lg:w-12 lg:h-12"
            src="/images/messages.png"
            alt=""
          />
        </div>

        {/* Profile */}
        <div className="cursor-pointer" title="Profile">
          <img
            className="w-8 h-8 lg:w-12 lg:h-12"
            src="/images/user.png"
            alt=""
          />
        </div>

        {/* Logout */}
        <div className="cursor-pointer" onClick={onLogout} title="Logout">
          <img
            className="w-8 h-8 lg:w-12 lg:h-12"
            src="/images/logout_logo.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
