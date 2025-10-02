import React from "react";
import { Routes, Route,Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./component/Login";

const App = () => {
  let authUser = null;
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to={"/home"} /> }/>
      </Routes>
    </div>
  );
};

export default App;
