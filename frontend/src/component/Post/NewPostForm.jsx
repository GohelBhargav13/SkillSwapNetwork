import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../../Validation/Validate.js";
import { axiosInstance } from "../../libs/axios.js";
import { Loader2, ImageIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="card bg-base-100 shadow-md border border-base-300/60 max-w-xl w-full mx-auto mt-20">
      {/* Header: avatar + “Create a post” */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <div className="avatar">
          <div className="w-10 rounded-full ring ring-primary/20 ring-offset-base-100 ring-offset-2">
            <img src="https://placeimg.com/80/80/people" alt="avatar" />
          </div>
        </div>
        <div>
          <p className="font-semibold leading-tight">Create a post</p>
          <p className="text-xs text-base-content/60">
            Share skills, wins, and updates
          </p>
        </div>
      </div>

      <div className="divider my-3" />

      {/* Body form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4 space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm text-base-content/70">Title</label>
          <input
            type="text"
            {...register("title")}
            placeholder="Add a short headline"
            className="input input-sm input-bordered w-full rounded-lg"
          />
          {errors.title && (
            <p className="text-xs text-error">{errors.title.message}</p>
          )}
        </div>

        {/* Description (LinkedIn-like textarea: roomy, subtle) */}
        <div className="space-y-1">
          <label className="text-sm text-base-content/70">Description</label>
          <textarea
            {...register("description")}
            placeholder="What do you want to talk about?"
            className="textarea textarea-bordered w-full min-h-[120px] rounded-lg"
          />
          {errors.description && (
            <p className="text-xs text-error">{errors.description.message}</p>
          )}
        </div>

        {/* Media picker row (icon + button) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 text-primary">
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
          {/* Optional character guidance like LinkedIn could go here */}
        </div>

        {/* Image preview chips */}
        {PostImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {PostImages.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 border border-base-300 rounded-lg px-2 py-1 bg-base-200/40"
              >
                <span className="text-xs max-w-[160px] truncate">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeImageAt(idx)}
                  className="btn btn-ghost btn-xs text-base-content/60 hover:text-error"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4 text-error" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inline error when no image chosen (mirrors your screenshot) */}
        {PostImages.length === 0 && (
          <p className="text-xs text-error">Please upload at least one image</p>
        )}

        {/* Footer bar: Cancel / Post (like LinkedIn) */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {/* <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
        
          </button> */}
          {console.log(loading)}
          <button
            type="submit"
            className={`btn btn-primary btn-sm ${
              loading ? "btn-disabled" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;
