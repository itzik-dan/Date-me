import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db as firebaseDB } from "../firebase.config";

const SingleMatchRow = ({ matchInfo, loggedInUserId }) => {
  const [matchedUserInfo, setMatchedUserInfo] = useState({});
  const [lastMsg, setLastMsg] = useState("");
  const navigate = useNavigate();

  // On mound get & isolate other user's full info extracted from matchInfo
  useEffect(() => {
    // Filter out logged in user id
    const matchedPersonId = matchInfo.usersMatched.filter(
      (user) => user !== loggedInUserId
    )[0];

    setMatchedUserInfo(matchInfo.users[matchedPersonId]);
  }, [loggedInUserId, matchInfo]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(firebaseDB, "matches", matchInfo.id, "messages"),
        orderBy("timestamp", "desc"),
        limit(1)
      ),
      (snapshot) => setLastMsg(snapshot.docs[0]?.data().message)
    );
  }, [matchInfo]);

  return (
    <div
      className="card shadow-md compact side bg-gray-700 hover:bg-gray-900 cursor-pointer my-2"
      onClick={() =>
        navigate("/messages", { state: { matchInfo, matchedUserInfo } })
      }
    >
      <div className="flex-row items-center space-x-4 card-body">
        <div className="avatar">
          <div className="rounded-full shadow w-14 h-14">
            <img src={matchedUserInfo.image} alt="Profile" />
          </div>
        </div>

        <div>
          <h2 className="card-title">{matchedUserInfo.name}</h2>
          <p className="text-xs">{lastMsg || "Make a move!"}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleMatchRow;
