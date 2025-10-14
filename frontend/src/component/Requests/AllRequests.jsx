import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../libs/axios.js";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { socket } from "../../Server.js"
import { useAuthStore } from "../../store/authStore.js"
const AllRequests = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [RequestLoading, setRequestLoading] = useState(false);
  const { authUser } = useAuthStore(); 

  useEffect(() => {
    // fetch the all request of the user show in the UI
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/skillswap/getall");
        setAllRequests(res.data.data.fetchAllPost);
      } catch (error) {
        toast.error("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();

    // Listen for the new Request is Posted
    socket.on("newRequest",({skillSwapReq,userPostInfo,message}) => {
      // console.log({ skillSwapReq,message,userPostInfo })
        const updatedData = {skillSwapReq,userPostInfo}
        setAllRequests((prevRequestPost) => [...prevRequestPost,updatedData])
        if(message) toast.success(message)
    })

    // Listen for the request is accepted
    socket.on("requestAccepted",({updatedpost,message}) => {
        setAllRequests((prevRequestPost) => prevRequestPost.filter((post) => post?._id !== updatedpost?._id )) 
        if(message) toast.success(message);
    })

    // Listen for the error coming from the server
    socket.on("errorPostLike",({message}) => {
      if(message) toast.error(message)
    })

    // For socket clean up
    return () => {
      socket.off("newRequest");
      socket.off("requestAccepted")
      socket.off("errorPostLike")
    }

  }, []);

  const handleAccept = async (requestId,acceptUserId) => {
    if (!requestId) {
      toast.error("Invalid Choice");
      return;
    }
    try {
      setRequestLoading(true);
      // const res = await axiosInstance.post(`/skillswap/${requestId}/accept`);
      // if (res.data.StatusCode === 200) {
      //   toast.success(res.data.message);
      // } else {
      //   toast.error(res.data.Message || "Unable to accept request");
      // }

      // update the change of the accept request using socket.io
      socket.emit("acceptRequest",{ requestId,acceptUserId })

    } catch (error) {
      toast.error("Error while accepting request");
    } finally {
      setRequestLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#141526]">
        <div className="text-lg text-white flex gap-2"><Loader2 className="animate-spin" />Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[89.8vh] bg-gray-900 flex flex-col items-center justify-center">
      {allRequests.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-lg">
          No skill swap requests found.
        </div>
      ) : (
        allRequests.map((request) => (
          <div
            key={request._id}
            className="w-full max-w-xl bg-gray-800 rounded-xl shadow-lg border border-base-300/60 px-8 py-7 mb-8"
          >
            <h3 className="text-xl font-bold text-base-content mb-3">{request.title}</h3>
            {/* Posted By */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={request.postUserId?.user_avatar || request.userPostInfo?.user_avatar} 
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
                style={{ background: "#202132" }}
              />
              <span className="font-semibold text-white text-base">{request.postUserId?.name || request.userPostInfo?.name}</span>
              <span className={`badge border-green-500 text-green-400 bg-transparent px-4 py-2 ml-3 text-base font-normal rounded-md`}>
                {request.skillStatus}
              </span>
            </div>
            {/* Wants */}
            <div className="mb-2">
              <div className="text-base-content/90 text-sm font-semibold mb-1">
                Skills They Want to Learn:
              </div>
              <div className="flex flex-wrap gap-2">
                {request.wantSkills.length === 0 ? (
                  <span className="italic text-gray-400">No skills specified</span>
                ) : (
                  request.wantSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="badge border-blue-700 text-blue-200 bg-transparent rounded-md font-medium px-4 py-2"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
            {/* Can Teach */}
            <div className="mb-6 mt-3">
              <div className="text-base-content/90 text-sm font-semibold mb-1">
                Skills They Can Teach:
              </div>
              <div className="flex flex-wrap gap-2">
                {request.offerSkills.length === 0 ? (
                  <span className="italic text-gray-400">No skills specified</span>
                ) : (
                  request.offerSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="badge border-pink-600 text-pink-300 bg-transparent rounded-md font-medium px-4 py-2"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
            {/* Accept Button */}
            <button
              onClick={() => handleAccept(request?._id,authUser?._id)}
              disabled={RequestLoading}
              className="w-full py-3 rounded-md bg-[#23d196] text-white text-base font-semibold transition hover:bg-[#19ac7c]
                disabled:pointer-events-none disabled:opacity-60"
            >
              {RequestLoading ? "Requesting..." : "Accept"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AllRequests;
