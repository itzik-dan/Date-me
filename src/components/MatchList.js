import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db as firebaseDB } from "../firebase.config";
import SingleMatchRow from "./SingleMatchRow";
import Spinner from "./Spinner";

const MatchList = ({ loggedInUserId }) => {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // On mound get logged in user matches
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(firebaseDB, "matches"),
          where("usersMatched", "array-contains", loggedInUserId)
        ),
        (snapshot) => {
          setMatches(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
          setLoadingMatches(false);
        }
      ),
    [loggedInUserId]
  );

  console.log("matches", matches);

  if (loadingMatches) {
    return <Spinner />;
  }

  return matches.length > 0 ? (
    <div className="rounded-lg shadow-lg card bg-base-100 overflow-y-scroll scrollbar-hide">
      <div className="card-body">
        <h2 className="text-3xl my-10 font-bold">Your Matches</h2>
        {matches.map((match) => (
          <SingleMatchRow
            key={match.id}
            matchInfo={match}
            loggedInUserId={loggedInUserId}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="p-5">
      <h1 className="text-center text-3xl">No matches at the moment 💋</h1>
    </div>
  );
};

export default MatchList;
