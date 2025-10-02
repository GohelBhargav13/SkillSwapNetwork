import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { ToastContainer, toast } from "react-toastify";

function LeaderBoard() {
  const [loading, setLoading] = useState(false);
  const [user, setUsers] = useState([]);

  useEffect(() => {
    const getLeaderBoard = async () => {
      setLoading(true);
      try {
        const response = await apiClient.fetchLeaderBoard();
        console.log(response);

        if (response.StatusCode >= 400) {
          toast.error(response.Message);
          return;
        } else {
          setUsers(response.data.finalResult);
          // toast.success(response.message);
          return;
        }
      } catch (error) {
        console.error(error.message);
        return;
      } finally {
        setLoading(false);
      }
    };

    getLeaderBoard();
  }, []);

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <span className="loading loading-infinity loading-xl"></span>
      ) : (
        <div className="text-center border-2">
          {user.length === 0 ? (
            <div>No User Found</div>
          ) : (
            user.map((userinfo, index) => (
              <div key={index}>
                <div>Rank : {userinfo.rank}</div>
                <div>Name : {userinfo.name}</div>
                <div>Token : {userinfo.token}</div>
              </div>
            ))
          )}
          {}
        </div>
      )}
    </div>
  );
}

export default LeaderBoard;
