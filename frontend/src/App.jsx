import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { Loader } from "lucide-react";

// Page Components
import Login from "./component/Login";
import Profile from "./component/Profile";
import Layout from "./layout/Layout";
import Firstpage from "./pages/Firstpage";
import PostCreate from "./pages/PostCreate";
import UpdateProfile from "./pages/UpdateProfile";

const App = () => {

  // Destructure auth state and actions from the store
  const { isChecking, checkinRoute, authUser } = useAuthStore();

  // Check authentication status on app load
  useEffect(() => {
    checkinRoute();
  }, [checkinRoute]);

  // checking for the authentication status
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
          <Route path="home" element={<Firstpage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create-post" element={<PostCreate />} />
          <Route path="update-profile" element={<UpdateProfile /> } />
        </Route>
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to={authUser ? "/home" : "/login"} />} />
      </Routes>
    </div>
  );
};

export default App;
