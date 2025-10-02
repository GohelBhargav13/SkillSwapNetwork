import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import apiClient from "../services/apiClient";

function Verify() {
  const [loading, setLoding] = useState(false);
  const [error, setError] = useState("");
  const [success,setSuccess] = useState("")

  //useNavigate for the routing
  const navigate = useNavigate();
  
  //fetch the token from the URL
  const { token } = useParams();

  useEffect(() => {
    setLoding(true);
    setError("");
    const verifyEmail = async () => {
      try {
        if (token) {
          const userToken = await apiClient.VerifyEmail(token);
          console.log(userToken);
          if (userToken.StatusCode >= 400) { 
            setError(userToken.Message);
          }else{
            setSuccess(userToken.data?.message);
            navigate("/login");
          }
        }
      } catch (error) {
        console.log(error);
        setError(error.message || "Error in Registartion");
      } finally {
        setLoding(false);
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <>
      {success && <h2 className="text-green-700 text-2xl">{success}</h2>}
      {error && <h2 className="text-red-700 text-2xl">{error}</h2>}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {loading ? (
          <span className="loading loading-infinity loading-xl"></span> // show loader
        ) : (
          <h2>"Hello For Verification"</h2>
        )}
      </div>
    </>
  );
}

export default Verify;
