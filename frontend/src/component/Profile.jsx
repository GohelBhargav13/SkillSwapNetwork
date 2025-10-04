import { useAuthStore } from "../store/authStore";


function Profile() {
  const { authUser } = useAuthStore();

  //Handel Logout Functionality

  return (
    <div className="border-2 bg-blue-300">
        <>
          <p>Profile</p>
          <p>Name : {authUser?.name}</p>
          <p>Token : {authUser?.token}</p>
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={authUser?.user_avatar}  alt="User"/>
            </div>
          </div>
        </>
    </div>
  );
}

export default Profile;
