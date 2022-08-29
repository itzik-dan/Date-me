import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MatchList from "../components/MatchList";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db as firebaseDB } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const MatchScreen = () => {
  // state below is for string profile image for header
  const [currentPic, setCurrentPic] = useState(null);
  const [loadingProfileInfo, setLoadingProfileInfo] = useState(true);

  const defaultProfilePic = "/images/default.png";

  // Get logged in auth info
  const auth = getAuth();

  const navigate = useNavigate();

  // On mount fetch user colection info
  useEffect(() => {
    const fetchUser = async () => {
      // Get user collection info from firestore
      const userRef = doc(firebaseDB, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      // If user has uploaded profile pic store it in state and pass to Header component to present it
      if (userSnap.data()?.image) setCurrentPic(userSnap.data()?.image);

      // If user has not completed his profile info and try to reach this screen via url window reirect him to profile form
      if (
        !userSnap.data()?.name ||
        !userSnap.data()?.age ||
        !userSnap.data()?.job ||
        !userSnap.data()?.gender ||
        !userSnap.data()?.intrestedIn
      ) {
        navigate("/profile");
      }

      setLoadingProfileInfo(false);
    };

    fetchUser();
  }, [auth, navigate]);

  if (loadingProfileInfo) {
    return <Spinner />;
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <Header
        currentPic={loadingProfileInfo ? defaultProfilePic : currentPic}
      />

      {/* Matches list */}
      <div className="w-1/2 lg:w-1/3 mx-auto mt-10">
        <MatchList loggedInUserId={auth.currentUser.uid} />
      </div>
    </div>
  );
};

export default MatchScreen;
