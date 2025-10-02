
import apiClient from "../services/apiClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../Validation/Validate.js";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  // check the data
  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="card w-full max-w-md shadow-xl bg-white rounded-lg p-8">

          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create Your Account
          </h2>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Email
                </span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.email ? "border-red-500" : ""}`}
                name="email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
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
                {...register("password")}
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.password ? "border-red-500" : ""}`}
                name="password"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
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
