import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import SwipeScreen from "./pages/SwipeScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import useAuth from "./hooks/useAuth";
import NotFound from "./components/NotFound";
import LoginRoute from "./components/LoginRoute";

const App = () => {
  const { loggedIn } = useAuth();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<SwipeScreen />} />
          </Route>
          {/* <Route path="/" element={<SwipeScreen />} /> */}
          {/* <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route> */}
          <Route path="/login" element={<LoginRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          {/* <Route path="/sign-up" element={<SignUp />} /> */}
          {/* <Route path="/create-listing" element={<CreateListing />} /> */}
          {/* <Route path="/edit-listing/:listingId" element={<EditLisiting />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
};

export default App;
