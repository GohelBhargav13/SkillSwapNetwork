import React from 'react'
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from '../../Validation/Validate.js'


const NewPostForm = () => {

    // destructure form 
    const { register,handleSubmit,formState:{errors} } = useForm({
        resolver:zodResolver(postSchema)
    })

    const onSubmit = (data) => {
        console.log(data);
    }

    // handel the images
    const handelImages = (e) => {
        console.log(e.target.files)
    }

  return (
   <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          {...register("title")}
          placeholder="Enter the title"
          className="input input-bordered"
        />
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          {...register("description")}
          placeholder="Enter the description"
          className="textarea textarea-bordered"
          rows={4}
        />
        {errors.description && <p className="text-red-600">{errors.description.message}</p>}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Upload Images</span>
        </label>
        <input
          type="file"
          {...register("post_image")}
          multiple
          onChange={(e) => handelImages(e)}
          className="file-input file-input-bordered"
          accept="image/*"
        />
        {errors.post_image && <p className="text-red-600">{errors.post_image.message}</p>}
      </div>

      <button type="submit" className="btn btn-primary">
        Submit Post
      </button>
    </form>
  )
}

export default NewPostForm