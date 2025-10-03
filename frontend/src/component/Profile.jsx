import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router";


function Profile() {

const navigate = useNavigate();

  const [userData, setData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.getMe();
        if(response.StatusCode >= 400){
         toast.error(response.Message);
          return;
        }else{
           setData(response.data);
        }
       
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Error in Data Fetching");
        return;
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  //Handel Logout Functionality
  const logOut = async() => {
     const response = await apiClient.logOut();
      console.log(response);

      if(response.StatusCode >= 400){
        toast.error(response.Message)
        navigate("/login");
        return;
      }else{
        toast.success(response.message)
        navigate("/login");
      }
  }

  return (
    <div className="border-2 bg-blue-300">
      {loading ? (
        <span className="loading loading-infinity loading-xl"></span>
      ) : (
        <>
          <p>Profile</p>
          <p>Name : {userData?.name}</p>
          <p>Token : {userData?.token}</p>
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={userData?.user_avatar}  alt="User"/>
            </div>
          </div>
          <button className="btn btn-primary" onClick={logOut}>logout</button>
        </>
      )}
    </div>
  );
}

export default Profile;
