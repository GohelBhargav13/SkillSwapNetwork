  import React, { useState } from "react";
  import apiClient from "../services/apiClient";
  import { useNavigate } from "react-router";
  import { toast,ToastContainer } from "react-toastify"

  function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("")

      try {
        const response = await apiClient.Login(email, password);
        console.log(response)

        if(Array.isArray(response)){
          const res = response.map((err) => Object.values(err)[0]);
          toast.error(res.join(","))
        }
        if (response.StatusCode >= 400) {
          toast.error(response.Message);
          console.log(response.Message);
          return;
        }
          toast.success(response.message || "Login Successfull") // unneeded 
          navigate("/home");
  
      } catch (error) {
          toast.error(error.message || "Error in Login")
      }finally{
        setLoading(false);
      }
    };

    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="card w-full max-w-md shadow-xl bg-white rounded-lg p-8">
          <ToastContainer />
            {/* Error Section */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* SuccessMessage Section */}
            {successMessage && (
              <p className="text-green-700 text-center mb-4">{successMessage}</p>
            )}
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Create Your Account
            </h2>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Email
                  </span>
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
                  <span className="label-text font-semibold text-gray-700">
                    Password
                  </span>
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
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-white text-lg font-semibold mt-2 hover:btn-secondary"
              >
                {loading ? "Logging..." : "Login"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-500 text-sm mt-6">
              don't have account?{" "}
              <a
                href="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </>
    );
  }

  export default Login;
