import { useState,useEffect } from "react";
import UserPost from "../component/Post/UserPost";
import { useAuthStore } from "../store/authStore.js"
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../libs/axios.js";

const OtherUserProfile = () => {
  const { authUser } = useAuthStore();
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [currentState, setCurrentState] = useState("post")

  const navigate = useNavigate();
  const params = useParams();

  // check the user is click on profile or the other profile
  useEffect(() => {
    const { name, id } = params;

    if(authUser?._id === id){
        return navigate("/profile")
    }
    const fetchAllData = async () => {
      try {
        const userPost = await axiosInstance.get(`/user/posts/${id}`);
        console.log(userPost.data.data);
        setUserPosts(userPost.data.data);

        const userData = await axiosInstance.get(`/user/profile/${name}/${id}`);
        console.log(userData.data.data);
        setUserInfo(userData.data.data);
      } catch (error) {
        console.log("Error in the profile", error);
      }
    };
    fetchAllData();
  }, [navigate, params]);

  return (
    <div className="min-h-[85vh] max-w-5xl mx-auto bg-gray-600 rounded-md shadow-md overflow-hidden mt-[35px]">
      {/* Cover */}
      <div className="relative h-48 bg-black">
        <img
          alt="Banner"
          className="w-full h-full object-cover"
          src={
            userInfo.bannerImage ||
            "https://placehold.co/1200x200/000000/ffffff"
          }
        />
        {/* Profile avatar */}
        <div className="absolute bottom-0 left-10 translate-y-1/2">
          <div className="avatar relative">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                alt="User avatar"
                src={
                  userInfo.user_avatar ||
                  "https://placehold.co/128x128/cccccc/000000?text=User+avatar"
                }
              />
            </div>
            <span className="absolute bottom-2 right-3 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Info + Actions */}
      <div className="px-16 pt-16 pb-6  flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-zinc-200">
            {userInfo.name || "Unknown"}
          </h1>
          {/* <p className="text-gray-600 text-lg mt-1">{authUser.pronouns}</p> */}
          <div className="flex flex-wrap items-center space-x-4 mt-1">
            {/* <p className="text-gray-600">{authUser.headline}</p> */}
          </div>
          {/* <p className="text-gray-600 mt-2">{authUser.location}</p> */}
        </div>
      </div>

      {/* Posts Section */}
      <UserPost
        userPosts={userPosts}
        currentState={currentState}
        authUserData={userInfo}
      />
    </div>
  );
};

export default OtherUserProfile;
