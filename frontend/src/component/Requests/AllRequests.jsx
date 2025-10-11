import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../libs/axios.js";
import { toast } from "react-hot-toast";
import { StatusBadge } from "../../store/Skills.js";

const AllRequests = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [RequestLoading, setRequestLoading] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/skillswap/getall");
        setAllRequests(res.data.data.fetchAllPost);
      } catch (error) {
        console.error("Error fetching requests:", error); 
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    // Implement accept logic here, e.g., API call
    if (!requestId) {
      console.log("Invalid Choice");
      toast.error("Invalid Choice");
    }
    console.log(requestId);
    try {
      setRequestLoading(true)
      const res = await axiosInstance.post(`/skillswap/${requestId}/accept`);
      console.log(res.data);
      if (res.data.StatusCode == 200) {
        console.log(res.data);
        toast.success(res.data.message);
      } else {
        console.log(res.data.Message);
        toast.error(res.data.Message);
      }
    } catch (error) {
      console.log("Error while accepting request", error);
    } finally {
      setRequestLoading(false);
      console.log("This is the final Stage of the request Accept");
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading requests...</div>;
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      {allRequests.length == 0 ? (
        <div className="text-center py-10 text-gray-500">
          No skill swap requests found.
        </div>
      ) : (
        allRequests.map((request) => (
          <div
            key={request._id}
            className="card bg-base-100 shadow-md rounded-lg p-4"
          >
            {/* Title */}
            <h3 className="text-lg font-bold mb-2">{request.title}</h3>

            {/* Posted By */}
            <div className="flex items-center mb-4 gap-3">
              <img
                src={request.postUserId?.user_avatar}
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">{request.postUserId?.name}</span>
              <span className={`badge ${StatusBadge[request.skillStatus] || "badge-ghost"} badge-outline`}>{request.skillStatus}</span>
            </div>

            {/* Skills They Want to Learn */}
            <div className="mb-2">
              <h4 className="text-sm font-semibold mb-1">
                Skills They Want to Learn:
              </h4>
              <div className="flex flex-wrap gap-2">
                {request.wantSkills.length === 0 ? (
                  <span className="italic text-gray-500">
                    No skills specified
                  </span>
                ) : (
                  request.wantSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="badge badge-primary badge-outline px-3 py-1"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Skills They Can Teach */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-1">
                Skills They Can Teach:
              </h4>
              <div className="flex flex-wrap gap-2">
                {request.offerSkills.length == 0 ? (
                  <span className="italic text-gray-500">
                    No skills specified
                  </span>
                ) : (
                  request.offerSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="badge badge-secondary badge-outline px-3 py-1"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Accept Button */}
            <button
              onClick={() => handleAccept(request?._id)}
              disabled={request.skillStatus != "OPEN" || RequestLoading}
              className="btn btn-success w-full text-white"
              aria-label="Accept skill swap request"
            >
              {RequestLoading ? "Requesting...." : "Accept"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AllRequests;
