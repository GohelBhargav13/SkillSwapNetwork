import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";
import { Loader, X } from "lucide-react";
const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // State For the verification
  const [isVerified, setIsVerified] = useState(false);

  // Check if not token available
  if (!token) {
    return <div>Invalid Token</div>;
  }

  console.log(token);

  useEffect(() => {
    try {
     setIsVerified(true);
      axiosInstance.get(`/user/verify/${token}`)
        .then((res) => {
            if (res.data.StatusCode == 200) {
                toast.success(res.data.data.message);
                navigate("/login");
            } else {
                toast.error("Please Try again");
                navigate("/login");
            }
        })
        .catch((err) => {
            console.log("Error in Verify Email : ", err);
            toast.error(err || "Verification Failed");
            navigate("/login");
        });
    } catch (error) {
      console.log("Catch Part Error : ", error);
    } finally {
      setIsVerified(false);
    }
  }, []);

  return (
    <>
      {isVerified && (
        <span className="w-8 h-8 bg-gray-900">
          <Loader className="animate-spin" /> Verification in Progress
        </span>
      )}
    </>
  );
};

export default Verify;
