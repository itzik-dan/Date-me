import { ArrowLeftIcon } from "@heroicons/react/solid";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Message from "../components/Message";
import { db as firebaseDB } from "../firebase.config";
import { useNavigate } from "react-router-dom";

const MessagesScreen = () => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { state } = useLocation();
  const endOfMessageRef = useRef(null);

  const auth = getAuth();
  const navigate = useNavigate();

  // Extracting loggged in user profile image to be passed to Header component
  const loggedInUserImage = state.matchInfo.users[auth.currentUser.uid]?.image;

  const UserPicPlaceholder = "/images/default.png";

  console.log("state", state);
  console.log("loggedInUserId", loggedInUserImage);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(firebaseDB, "matches", state.matchInfo.id, "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
          endOfMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      ),
    [state.matchInfo]
  );

  const sendMessage = (e) => {
    e.preventDefault();

    if (!messageInput) return;

    addDoc(collection(firebaseDB, "matches", state.matchInfo.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid,
      displayName: state.matchInfo.users[auth.currentUser.uid].name,
      photoURL: state.matchInfo.users[auth.currentUser.uid].image,
      message: messageInput,
    });

    endOfMessageRef.current.scrollIntoView({ behavior: "smooth" });
    setMessageInput("");
  };

  console.log("state", state);
  return (
    <>
      <div className="h-screen relative">
        <Header currentPic={loggedInUserImage || UserPicPlaceholder} />

        <div className="flex h-2/3 flex-col items-center">
          <div className="flex-1 w-2/3 lg:w-1/2 mx-auto mt-10 rounded-lg shadow-2xl bg-base-100 overflow-y-scroll scrollbar-hide">
            <div className="sticky top-0 z-50 bg-gray-800 p-4 flex flex-row items-center justify-start space-x-4">
              <div onClick={() => navigate(-1)}>
                <ArrowLeftIcon className="h-10 w-10 text-white cursor-pointer hover:text-blue-500" />
              </div>
              <p>You &#38; {state.matchedUserInfo.name}</p>
            </div>

            <div className="space-y-10 p-6">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </div>

            <div
              ref={endOfMessageRef}
              className="text-center text-gray-400 mb-20"
            >
              <p>You&#39;re up to date!</p>
            </div>
          </div>

          <form className="flex fixed bottom-10 bg-black opacity-80 w-11/12 px-6 py-4 max-w-2xl shadow-xl rounded-full border-4 border-blue-400">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-grow outline-none bg-transparent text-white placeholder-gray-500 pr-5"
              placeholder={`Enter a Message`}
            />
            <button
              type="submit"
              onClick={sendMessage}
              className="font-bold text-pink-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MessagesScreen;
