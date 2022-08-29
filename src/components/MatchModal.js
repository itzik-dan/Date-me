import { XCircleIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

const MatchModal = ({ setMatchModal, loggedInProfile, userSwiped }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full absolute top-0 left-0 flex z-50 items-center justify-center">
      <div className="relative w-4/5 h-1/2 lg:w-1/3 lg:h-2/3 bg-rose-800 rounded-3xl p-10 flex flex-col items-center justify-between">
        <h1 className="text-3xl lg:text-5xl font-bold italic">
          IT IS A MATCH!
        </h1>
        <h2 className="text-xl lg:text-2xl">{`You matched with ${userSwiped.name}`}</h2>
        <div className="flex w-full justify-evenly mt-5">
          <img
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover"
            src={loggedInProfile.image}
            alt=""
          />
          <img
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover"
            src={userSwiped.image}
            alt=""
          />
        </div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => setMatchModal(false)}
            className="btn btn-xs md:btn-sm btn-ghost"
          >
            Continue Swiping
          </button>
          <button
            onClick={() => navigate("/matches")}
            className="btn btn-xs md:btn-sm glass"
          >
            Start Chatting <span className="pl-2 text-xl">😍</span>{" "}
          </button>
        </div>
        <XCircleIcon
          onClick={() => setMatchModal(false)}
          className="h-10 w-10 text-white absolute top-2 right-2 z-10 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MatchModal;
