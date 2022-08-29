import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import googleIcon from "./svg/googleIcon.svg";

const OAuth = ({ setLoading }) => {
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setLoading(true);
      const user = result.user;

      // Check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      // Redirect to home page
      navigate("/");
      setLoading(false);
    } catch (error) {
      toast.error("Could not authorize with google");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p>Sign in with</p>
      <button
        className="curser-pointer w-12 h-12 mt-12"
        onClick={onGoogleClick}
      >
        <img className="animate-bounce" src={googleIcon} alt="Google" />
      </button>
    </div>
  );
};

export default OAuth;
