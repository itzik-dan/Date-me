import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfileNotComplete = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="relative">
      <div className="min-h-screen mx-auto max-w-screen-lg flex flex-col justify-center items-center -mt-20">
        <p className="text-center text-9xl mb-10">Ready to swipe?</p>
        <p className="text-center text-4xl mb-10">One Last step</p>
        <Link to="/profile">
          <button className="btn">Please complete your profile info </button>
        </Link>
        <button onClick={onLogout} className="btn absolute top-24 right-20">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileNotComplete;
