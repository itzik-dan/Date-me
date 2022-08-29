import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import SwipeScreen from "./pages/SwipeScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import UpdateProfile from "./pages/UpdateProfile";
import MatchScreen from "./pages/MatchScreen";
import MessagesScreen from "./pages/MessagesScreen";
import MsgRoute from "./components/MsgRoute";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<SwipeScreen />} />
          </Route>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<UpdateProfile />} />
          </Route>
          <Route path="/matches" element={<PrivateRoute />}>
            <Route path="/matches" element={<MatchScreen />} />
          </Route>
          <Route path="/messages" element={<MsgRoute />}>
            <Route path="/messages" element={<MessagesScreen />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
};

export default App;
