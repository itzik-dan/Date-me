import { getAuth } from "firebase/auth";
import React from "react";
import TimeAgo from "react-timeago";

const Message = ({ message }) => {
  const auth = getAuth();
  const loggedInUserMsg = message.userId === auth.currentUser.uid;

  return (
    <div
      className={`flex items-end space-x-2 relative ${
        loggedInUserMsg && "justify-end"
      }`}
    >
      <div
        className={`relative h-8 w-8 avatar ${
          loggedInUserMsg && "order-last ml-2"
        }`}
      >
        <img src={message.photoURL} alt="Profile" className="rounded-full" />
      </div>

      <div
        className={`flex space-x-5 p-3 rounded-lg ${
          loggedInUserMsg
            ? "rounded-br-none bg-blue-500"
            : "rounded-bl-none bg-gray-300"
        }`}
      >
        <p className={`${loggedInUserMsg ? "text-white" : "text-black"}`}>
          {message.message}
        </p>
      </div>

      {/* Timeago stamp */}
      {message ? (
        <TimeAgo
          className={`text-[10px] italic text-gray-400 ${
            loggedInUserMsg && "order-first pr-1"
          }`}
          date={message?.timestamp?.toDate()}
        />
      ) : (
        <p>Loading time...</p>
      )}

      <p
        className={`absolute -bottom-5 text-xs ${
          loggedInUserMsg ? "text-pink-300" : "text-blue-400"
        }`}
      >
        {message.displayName}
      </p>
    </div>
  );
};

export default Message;
