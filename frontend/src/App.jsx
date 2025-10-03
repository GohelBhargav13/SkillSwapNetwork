import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { Loader } from "lucide-react";

// Page Components
import Login from "./component/Login";
import PostView from "./component/PostView";
import Profile from "./component/Profile";
import Layout from "./layout/Layout";

const App = () => {
  const { isChecking, checkinRoute, authUser } = useAuthStore();

  useEffect(() => {
    checkinRoute();
  }, [checkinRoute]);

  if (isChecking && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/home" />} />
        <Route path="/" element={authUser ? <Layout /> : <Navigate to="/login" />}>
          <Route path="home" element={<PostView />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to={authUser ? "/home" : "/login"} />} />
      </Routes>
    </div>
  );
};

export default App;
