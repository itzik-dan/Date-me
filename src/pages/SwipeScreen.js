import Header from "../components/Header";
import React, { useState, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db as firebaseDB } from "../firebase.config";
import Spinner from "../components/Spinner";
import ProfileNotComplete from "../components/ProfileNotComplete";
import { HeartIcon } from "@heroicons/react/solid";
import MatchModal from "../components/MatchModal";

const SwipeScreen = () => {
  // State for storing profiles from firbase db users collection
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loadingProfileInfo, setLoadingProfileInfo] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [currentPic, setCurrentPic] = useState(null);
  // State for storing the logged in user's full profile info
  const [loggedInProfile, setLoggedInProfile] = useState({});
  // State for storing the last user swiped yes on by logged in user
  const [userSwiped, setUserSwiped] = useState({});
  // State for storing visibility of match modal
  const [matchModal, setMatchModal] = useState(false);
  // State for disabling like/dislike buttons until profile card is out of screen, to avoid clicking fast and passing wrong data profile to match modal
  const [outOfScreen, setOutOfScreen] = useState(true);

  // Get logged in auth info
  const auth = getAuth();

  // Utility func for creating unique match id if 2 users are matched
  const generateId = (id1, id2) => (id1 > id2 ? id1 + id2 : id2 + id1);

  // Fetch profiles
  useEffect(() => {
    let unsubscribe;

    // Fetch profiles from firebase db users collection, excluding the current user
    const fetchProfiles = async () => {
      // Get logged in user desired gender
      const userRef = doc(firebaseDB, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const { intrestedIn } = userSnap.data();

      // Get all profiles ids which currrently logged in user swiped left (no) on
      const passes = await getDocs(
        collection(firebaseDB, "users", auth.currentUser.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      // Get all profiles ids which currrently logged in user swiped right (yes) on
      const swipes = await getDocs(
        collection(firebaseDB, "users", auth.currentUser.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds =
        passes.length > 0
          ? passes
          : ["placeholder to avoid error when quering firebase db below"];

      const swipedUserIds =
        swipes.length > 0
          ? swipes
          : ["placeholder to avoid error when quering firebase db below"];

      unsubscribe = onSnapshot(
        query(
          collection(firebaseDB, "users"),
          // Filter out the profiles logged in user already swiped left or right on
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          // Filter out currently logged in user and the other gender that logged in user is not intrested in
          setProfiles(
            snapshot.docs
              .filter(
                (doc) =>
                  doc.id !== auth.currentUser.uid &&
                  doc.data().gender === intrestedIn
              )
              .map((doc) => ({ id: doc.id, ...doc.data() }))
          );
          setCurrentIndex(
            snapshot.docs
              .filter(
                (doc) =>
                  doc.id !== auth.currentUser.uid &&
                  doc.data().gender === intrestedIn
              )
              .map((doc) => ({ id: doc.id, ...doc.data() })).length - 1
          );
          setLoadingProfiles(false);
        }
      );
    };

    // Only if user completed all his info call fetchProfile funtction
    loggedInProfile?.name &&
      loggedInProfile?.age &&
      loggedInProfile?.job &&
      loggedInProfile?.gender &&
      loggedInProfile?.intrestedIn &&
      fetchProfiles();

    return unsubscribe;
  }, [auth.currentUser, loggedInProfile]);

  // On mount fetch user colection info
  useEffect(() => {
    const fetchUser = async () => {
      // Get user collection info from firestore
      const userRef = doc(firebaseDB, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      // If user has uploaded profile pic store it in state and pass to Header component to present it
      if (userSnap.data()?.image) setCurrentPic(userSnap.data()?.image);

      setLoggedInProfile(userSnap.data());
      setLoadingProfileInfo(false);
    };

    fetchUser();
  }, [auth.currentUser]);

  // ---------- Code below is from react tinder cards npm package - https://github.com/3DJakob/react-tinder-card-demo/blob/master/src/examples/Advanced.js

  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = Array(profiles.length)
    .fill(0)
    .map((i) => React.createRef());

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  // Handle swipe right/left plus update last direction & decrease current index
  const swiped = (direction, nameToDelete, index, character) => {
    setOutOfScreen(false);
    // User swiped left/no ------------------------------------------------
    if (direction === "left") {
      if (!profiles.find((element) => element.id === character.id)) return;

      const userSwiped = profiles.find(
        (element) => element.id === character.id
      );
      setUserSwiped(userSwiped);
      console.log(`You swiped NO on ${userSwiped.name}`);

      // Add user to a nested passes collection inside logged in user collection
      setDoc(
        doc(firebaseDB, "users", loggedInProfile.id, "passes", userSwiped.id),
        userSwiped
      );
    }

    // User swiped right/yes ------------------------------------------------
    if (direction === "right") {
      if (!profiles.find((element) => element.id === character.id)) return;

      const userSwiped = profiles.find(
        (element) => element.id === character.id
      );
      setUserSwiped(userSwiped);

      // Check if the user swiped on you...
      getDoc(
        doc(firebaseDB, "users", userSwiped.id, "swipes", loggedInProfile.id)
      ).then((documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // User has swiped on you before you swiped on him
          // Create a MATCH!
          console.log(`It is a match with ${userSwiped.name}`);
          setMatchModal(true);

          setDoc(
            doc(
              firebaseDB,
              "users",
              loggedInProfile.id,
              "swipes",
              userSwiped.id
            ),
            userSwiped
          );

          // Create a match!
          setDoc(
            doc(
              firebaseDB,
              "matches",
              generateId(loggedInProfile.id, userSwiped.id)
            ),
            {
              users: {
                [loggedInProfile.id]: loggedInProfile,
                [userSwiped.id]: userSwiped,
              },
              usersMatched: [loggedInProfile.id, userSwiped.id],
              timestamp: serverTimestamp(),
            }
          );
        } else {
          // Other user have yet to swiped on you
          console.log(`You swiped YES on ${userSwiped.name}`);

          // Add user to a nested swipes collection inside logged in user collection
          setDoc(
            doc(
              firebaseDB,
              "users",
              loggedInProfile.id,
              "swipes",
              userSwiped.id
            ),
            userSwiped
          );
        }
      });
    }

    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    setOutOfScreen(true);
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < profiles.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  console.log("profiles", profiles);

  // ---------- End of react tinder package functionnality

  if (loadingProfileInfo || loadingProfiles) {
    return <Spinner />;
  }

  // Check if user profile is complete, if not link to profile form
  if (
    !loggedInProfile?.name ||
    !loggedInProfile?.age ||
    !loggedInProfile?.job ||
    !loggedInProfile?.gender ||
    !loggedInProfile?.intrestedIn
  ) {
    return <ProfileNotComplete />;
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Header */}
      <Header currentPic={currentPic} />

      {/* Match modal with info about the match */}
      {matchModal && (
        <MatchModal
          setMatchModal={setMatchModal}
          loggedInProfile={loggedInProfile}
          userSwiped={userSwiped}
        />
      )}

      {/* Cards */}
      <div className="flex flex-col justify-center items-center max-w-3xl mx-auto mt-4 relative">
        <h1
          className={`font-mono text-3xl absolute top-4 ${
            matchModal && "hidden"
          }`}
        >
          Date Me
        </h1>

        {canSwipe ? (
          profiles.map((character, index) => (
            <TinderCard
              ref={childRefs[index]}
              className={`absolute top-20 ${matchModal && "hidden"}`}
              key={character.name}
              preventSwipe={["up", "down"]}
              onSwipe={(dir) => swiped(dir, character.name, index, character)}
              onCardLeftScreen={() => outOfFrame(character.name, index)}
            >
              <div
                style={{ backgroundImage: "url(" + character.image + ")" }}
                className="relative bg-white p-56 lg:p-60 bg-center bg-cover shadow-md rounded-lg"
              >
                <div className="absolute bg-white bottom-0 left-0 right-0 mx-auto text-xl text-gray-900 p-2 flex justify-between">
                  <h3>{character.name}</h3>
                  <h3 className="font-bold">{character.age}</h3>
                </div>
              </div>
            </TinderCard>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center mt-20 p-20 space-y-6 lg:p-30 shadow-md rounded-lg">
            <h1 className="text-2xl">No more profiles!</h1>
            <HeartIcon className="h-20 w-20 text-red-500" />
            <h1 className="text-2xl">Please try again soon</h1>
          </div>
        )}
      </div>

      {/* Like and dislike buttons */}
      {canSwipe && !matchModal && outOfScreen && (
        <div className="absolute bottom-12 left-0 right-0 w-2/3 lg:w-1/3 mx-auto">
          <div className="flex justify-around items-center">
            <img
              src="/images/dislike.png"
              className="h-12 w-12 cursor-pointer"
              alt="dislike"
              onClick={() => swipe("left")}
            />
            <img
              className="h-12 w-12 cursor-pointer"
              src="/images/like.png"
              alt="like"
              onClick={() => swipe("right")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeScreen;
