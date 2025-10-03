import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { Loader } from "lucide-react";

// All pages are imported here
import Login from "./component/Login";
import PostView from "./component/PostView";
import Profile from "./component/Profile";

const App = () => {
  const { isChecking, checkinRoute, authUser } = useAuthStore();

  // First time page load than checking of the user is login or not
  useEffect(() => {
    checkinRoute();
  }, [checkinRoute]);

  // check the user is checking for the
  if (isChecking && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }
  return (
    <div>
      <Toaster />
      <Routes>
        <Route 
        path="/home" 
        element={authUser ? <PostView /> : <Login />} />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/home"} />}
        />
        <Route path="/home" element={!authUser ? <Login /> : <PostView />} />
        <Route path="/profile" element={!authUser ? <Login /> : <Profile />} />
      </Routes>
    </div>
  );
};

export default App;
