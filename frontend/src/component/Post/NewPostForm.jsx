import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../../Validation/Validate.js";
import { axiosInstance } from "../../libs/axios.js";
import { ImageIcon, X, FileBadge2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../Server.js"
import { useAuthStore } from "../../store/authStore.js"

const NewPostForm = () => {
  const [PostImages, setPostImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // destructure form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    try {
      console.log("Clicked");

      if (PostImages.length === 0 || PostImages === undefined) {
        toast.error("Please Upload a Image");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      // postImages are in the form of an array
      PostImages.forEach((file) => {
        formData.append("post_images", file);
      });

      console.log("data is here")

      // fetch the data from the backend
      axiosInstance
        .post("/post/createpost", formData)
        .then((res) => {
          toast.success("Post created successfully!");
          navigate("/home");
          console.log(res.data);
        })
        .catch((err) => {
          toast.error("Error in creating post");
          console.log("Error in fetching a data : ", err);
        });

        
    } catch (error) {
      toast.error("This is error in the catch block");
      console.log("Error of the catch block : ", error);
    }
  };

  // handel the images
  const handleImages = (e) => {
    console.log("Handle Submit call of the images");
    const files = Array.from(e.target.files);
    setPostImages(files);
  };

  const removeImageAt = (id) => {
    setPostImages((prev) => prev.filter((_, i) => i !== id));
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-900">
      <div className="card w-full max-w-lg shadow-2xl border border-base-300/70 bg-gray-800 rounded-xl mx-auto">
        {/* Header */}
        <div className="px-6 pt-6 flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-2 flex items-center justify-center bg-base-200">
              <FileBadge2 className="w-8 h-8 m-[7px]  text-primary" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-base-content text-md">
              Create a post
            </p>
            <span className="text-xs text-base-content/60">
              Share skills, wins, and updates
            </span>
          </div>
        </div>
        <div className="divider my-2" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 pb-8 pt-2 space-y-5"
        >
          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-base-content/80 text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="Add a short headline"
              className="input input-bordered w-full bg-base-200/30 text-base-content rounded-lg"
            />
            {errors.title && (
              <p className="text-xs mt-1 text-error">{errors.title.message}</p>
            )}
          </div>
          {/* Description */}
          <div className="space-y-1">
            <label className="text-base-content/80 text-sm font-medium">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="What do you want to talk about?"
              className="textarea textarea-bordered w-full min-h-[110px] bg-base-200/30 text-base-content rounded-lg"
            />
            {errors.description && (
              <p className="text-xs mt-1 text-error">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Images Input + Preview  */}
          <div className="flex items-center justify-between">
            <label className="cursor-pointer inline-flex items-center gap-2 text-primary font-medium">
              <ImageIcon className="w-5 h-5" />
              <span className="text-sm">Add images</span>
              <input
                type="file"
                multiple
                onChange={handleImages}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
          {PostImages.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {PostImages.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 border border-base-300 rounded-lg px-2 py-1 bg-base-200/60"
                >
                  <span className="text-xs max-w-[120px] truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImageAt(idx)}
                    className="btn btn-ghost btn-xs text-error"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {PostImages.length === 0 && (
            <p className="text-xs text-error pt-1">
              Please upload at least one image
            </p>
          )}
          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className={`btn btn-primary btn-md min-w-[80px] rounded-lg ${
                loading ? "btn-disabled opacity-80" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostForm;
