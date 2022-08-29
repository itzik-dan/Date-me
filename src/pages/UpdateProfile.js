import { doc, serverTimestamp, updateDoc, getDoc } from "@firebase/firestore";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadString,
} from "@firebase/storage";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import { UploadIcon } from "@heroicons/react/outline";
import Header from "../components/Header";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/solid";

const UpdateProfile = () => {
  // Get logged in auth info
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");
  const [gender, setGender] = useState("Men");
  const [intrestedIn, setIntrestedIn] = useState("Women");
  const [currentPic, setCurrentPic] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  // Fetch user collection and prefill form prior to editing
  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      userSnap.data().name && setUsername(userSnap.data().name);
      userSnap.data().age && setAge(userSnap.data().age);
      userSnap.data().job && setJob(userSnap.data().job);
      userSnap.data().gender && setGender(userSnap.data().gender);
      userSnap.data().intrestedIn &&
        setIntrestedIn(userSnap.data().intrestedIn);
      userSnap.data().image
        ? setCurrentPic(userSnap.data().image)
        : setCurrentPic(auth.currentUser.photoURL);
      setLoading(false);
    };

    fetchUser();
  }, [auth.currentUser]);

  const addImageToProfile = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedImage(readerEvent.target.result);
      // In order to uplaod same pic again add the below
      e.target.value = "";
    };
  };

  // console.log("selectedimage", selectedImage);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Update listing
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, {
      name: username,
      age,
      job,
      gender,
      intrestedIn,
      image: currentPic,
      timestamp: serverTimestamp(),
    });

    // Store images in firebase
    const storage = getStorage();
    const fileName = `${auth.currentUser.uid}-${uuidv4()}`;

    const imageRef = ref(storage, "images/" + fileName);

    // If user uploaded profile pic run the function to upload to firebase storatge and update image field in user collection
    selectedImage &&
      (await uploadString(imageRef, selectedImage, "data_url").then(
        async (snapshot) => {
          const downloadUrl = await getDownloadURL(imageRef);
          await updateDoc(docRef, { image: downloadUrl });
        }
      ));

    setSelectedImage(null);
    setCurrentPic(null);
    setLoading(false);
    toast.success("Profile updated!");
    navigate("/");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="">
      <Header currentPic={currentPic} />

      <h1 className="text-2xl lg:text-3xl text-center mt-6">
        Please complete your profile
      </h1>

      <form className="w-1/2 lg:w-1/3 mx-auto mt-10" onSubmit={submitHandler}>
        {/* Username */}
        <div className="form-control mb-2">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-info input-bordered"
            required
          />
        </div>

        {/* Age */}
        <div className="form-control mb-2">
          <label className="label">
            <span className="label-text">Age</span>
          </label>
          <input
            type="number"
            placeholder="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input input-info input-bordered"
            required
          />
        </div>

        {/* Job */}
        <div className="form-control mb-2">
          <label className="label">
            <span className="label-text">Job</span>
          </label>
          <input
            type="text"
            placeholder="job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="input input-info input-bordered"
            required
          />
        </div>

        {/* Your gender */}
        <div className="mb-2">
          <label className="label">
            <span className="label-text">Your gender:</span>
          </label>
          <div className="p-2 card bordered">
            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text">Men</span>
                <input
                  type="radio"
                  checked={gender === "Men"}
                  className="radio"
                  value="Men"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text">Women</span>
                <input
                  type="radio"
                  checked={gender === "Women"}
                  className="radio radio-primary"
                  value="Women"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Gender you like */}
        <label className="label">
          <span className="label-text">Intrested in meeting:</span>
        </label>
        <div className="p-2 card bordered">
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text">Men</span>
              <input
                type="radio"
                checked={intrestedIn === "Men"}
                className="radio"
                value="Men"
                onChange={(e) => setIntrestedIn(e.target.value)}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text">Women</span>
              <input
                type="radio"
                checked={intrestedIn === "Women"}
                className="radio radio-primary"
                value="Women"
                onChange={(e) => setIntrestedIn(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Upload pic */}
        <div className="flex items-center justify-around">
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              // if user uploaded profile pic display it otherwise display google auth pic
              src={currentPic}
              alt="profile-pic"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center h-full mt-4">
              <div className="flex flex-col justify-center items-center">
                <p className="font-bold text-2xl">
                  <UploadIcon className="h-20 w-20" />
                </p>
                <p className="text-lg hidden lg:inline-block">
                  Click to upload profile picture
                </p>
              </div>
            </div>
            <input
              type="file"
              name="upload-image"
              onChange={addImageToProfile}
              className="w-0 h-0"
            />
          </label>
          {selectedImage && (
            <div className="relative w-24 h-24 flex-shrink-0">
              <XCircleIcon
                onClick={() => setSelectedImage(null)}
                className="h-5 w-5 text-red-500 absolute top-0 left-0 z-10 cursor-pointer"
              />
              <img
                src={selectedImage}
                className="w-full h-full object-cover animate-pulse"
                alt=""
              />
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          disabled={!username || !age || !job}
          type="submit"
          className="btn w-full mt-6"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
