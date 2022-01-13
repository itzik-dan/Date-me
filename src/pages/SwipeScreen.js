import Header from "../components/Header";
import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import db from "../utils/db";

const SwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();

  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Header */}
      <Header />
      {/* End of Header */}

      {/* Cards */}
      <div className="flex flex-col justify-center items-center max-w-3xl mx-auto relative">
        <h1 className="font-mono text-3xl absolute top-0">Date Me</h1>

        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="absolute top-20"
            key={character.name}
            preventSwipe={["up", "down"]}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              style={{ backgroundImage: "url(" + character.url + ")" }}
              className="relative bg-white p-56 bg-center bg-cover shadow-md rounded-lg"
            >
              <div className="absolute bg-white bottom-0 left-0 right-0 mx-auto text-xl text-gray-900 p-2 flex justify-between">
                <h3>{character.name}</h3>
                <h3 className="font-bold">{character.age}</h3>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Like and dislike buttons */}
      <div className="absolute bottom-10 left-0 right-0 w-2/3 mx-auto">
        <div className="flex justify-around items-center">
          <img
            src="/images/dislike.png"
            className="h-12 w-12 cursor-pointer"
            alt="dislike"
            onClick={() => swipe("left")}
          />
          <button
            className="btn btn-sm btn-primary"
            disabled={!canGoBack}
            onClick={() => goBack()}
          >
            Undo swipe!
          </button>
          <img
            className="h-12 w-12 cursor-pointer"
            src="/images/like.png"
            alt="like"
            onClick={() => swipe("right")}
          />
        </div>
        {lastDirection && (
          <h2 key={lastDirection} className="text-center">
            You swiped {lastDirection}
          </h2>
        )}
      </div>
    </div>
  );
};

export default SwipeScreen;
