import React, { useState } from "react";
import apiClient from "../../services/apiClient";
import { toast, ToastContainer } from "react-toastify";

function CreatePost() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [postImage, setPostImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // for the form submission
    setLoading(true);

    try {
      const response = await apiClient.CreatePost(title, desc, postImage);
      const { StatusCode,message } = response;
      console.log(message);

      if(!response.success){
        toast.error(response.Message);
        return;
      }
      if (StatusCode >= 400) {
        toast.error(response.Message);
        return;
      } else {
        // console.log("Here...")
        toast.success(message);
        return;
      }
    } catch (error) {
      toast.error(error.message || "Error While Creating Post");
      return;
    } finally {
      setLoading(false);
      setTitle("");
      setDesc("");
      setPostImage(null);
    }
  };

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <span className="loading loading-infinity loading-xl"></span>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="card w-full max-w-md shadow-xl bg-white rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Create Post
            </h2>

            <form
              className="flex flex-col gap-5 align-center"
              onSubmit={handleSubmit}
            >
              {/* Name */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Title
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Title forEx: React Learn"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Description
                  </span>
                </label>
                <textarea
                  minLength={10}
                  maxLength={500}
                  type="text"
                  placeholder="Description ForEx: 'Learn React' "
                  className="input input-bordered w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={desc}
                  name="description"
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
              </div>
              {/* Avatar Upload */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Post Images
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="post_images"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setPostImage(e.target.files[0])}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-white text-lg font-semibold mt-2 hover:btn-secondary"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Create Post"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePost;
