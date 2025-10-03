import { useAuthStore } from "../store/authStore";


function Profile() {
  const { authUser,userLogout } = useAuthStore();

  //Handel Logout Functionality
  const logOut = async() => {
    try {
      await userLogout();
    } catch (error) {
      console.log("Error in Logout : ",error)
    }
  }

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
          <button className="btn btn-primary" onClick={logOut}>logout</button>
        </>
    </div>
  );
}

export default Profile;
