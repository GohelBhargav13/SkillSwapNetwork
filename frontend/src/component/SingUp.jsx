import { useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../services/apiClient";
import { toast } from "react-toastify";

function SingUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_avatar, setUserAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage,setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const {
        StatusCode,
        data = {},
        Message = "",
        errors = [],
        message=""
      } = await apiClient.singUP(email, name, password, user_avatar);

      if (StatusCode >= 400) {
        if(errors?.length > 0){
            errors?.array().forEach((err) => (
                setError(prev => ({...prev,[err.path] : err.msg}))
            ));
        }else{
            toast.error(Message)
        }
      }else{
        toast.success(message)
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card w-full max-w-md shadow-xl bg-white rounded-lg p-8">

        {/* Error Section */}
        {error && <p className="text-red-500 text-center mb-4">{ error }</p>}

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Account
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Profile Picture</span>
            </label>
            <input
              type="file"
              accept="image/*"
              name="user_avatar"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setUserAvatar(e.target.files[0])}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full text-white text-lg font-semibold mt-2 hover:btn-secondary"
          >
            { loading ? "Singing Up..." : "Sign Up" }
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>

    </>
  );
}

export default SingUp;
