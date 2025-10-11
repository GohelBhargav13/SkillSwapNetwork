import React, { useState } from 'react'
import { AvailableSkills } from "../store/Skills.js"
import { axiosInstance } from "../libs/axios.js"
import toast from 'react-hot-toast'

const RequestPost = () => {

    const [userWantSkills,setUserWantSkills] = useState([])
    const [userSkillTeach,setUserSkillTeach] = useState([])
    const [AdditionalMessage,setAdditionalMessage] = useState("");
    const [userTitle,setUserTitle] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
          title:userTitle,
          wantSkills:userWantSkills,
          offerSkills:userSkillTeach
        }

        console.log("submit");
        console.log("data", data);

        try {

        axiosInstance.post("/skillswap/createrequest",data)
        .then((res) => {
          console.log("Response Data is : ",res)
          toast.success(res.data.message)
        })
        .catch((err) => {
          console.log("Error in this fetching data is : ",err)
        })
          
        } catch (error) {
          console.log(error);
          toast.error(error)
        }finally{
          setUserSkillTeach([]);
          setAdditionalMessage("");
          setUserWantSkills([]);
          setUserTitle("");
        }
    }
  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 p-6 max-w-md mx-auto space-y-4 rounded-lg shadow py-8 m-6">
      <h2 className="text-xl font-bold mb-4 text-primary">Request Skill Swap</h2>

      <div className='form-control'>
        <label className='label'>Enter a Title</label>

        <input className='w-8 h-8'
        type='text'
        value={userTitle}
        onChange={(e) => {
          setUserTitle(e.target.value)
        }}
         />
      </div>

      <div className="form-control">
        <label className="label">Skills You Want to Learn</label>

        <select
          className="select select-bordered"
          onChange={(e) => {
            if(e.target.value == "Select Skill") return
            setUserWantSkills([...userWantSkills,e.target.value])
          }}
        >
          <option value="Select Skill" label='Select Skill'>Select Skill</option>
          <option value="React Js" label='React Js'>React Js</option>
          <option value="Express Js" label='Express Js'>Express Js</option>
          <option value="Core Java" label='Core Java'>Core Java</option>
          <option value="MongoDB" label='MongoDB'>MongoDB</option>
          <option value="PHP" label='PHP'>PHP</option>
          <option value="Node Js" label='Node Js'>Node Js</option>
          <option value="JWT" label="JWT">JWT</option>
        </select>
        {userWantSkills.map((data) => console.log(data) )}
        {console.log("final Array of the userwantSkills : ",userWantSkills)}
      </div>

      <div className="form-control">
        <label className="label">Skills You Can Offer (optional)</label>
        <select
          className="select select-bordered"
          onChange={(e) => {
            if(e.target.value == "Select Skill") return
            setUserSkillTeach([...userSkillTeach,e.target.value])
          }}
        >
        <option value="Select Skill" label='Select Skill'>Select Skill</option>
        <option value="Node Js" label='Node Js'>Node Js</option>
        <option value="React Js" label='React Js'>React Js</option>
        <option value="PHP" label='PHP'>PHP</option>
        <option value="Core Java" label='Core Java'>Core Java</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">Additional Message</label>
        <textarea
          className="textarea textarea-bordered"
          rows={4}
          value={AdditionalMessage}
          placeholder="Message (optional)"
          onChange={(e) => setAdditionalMessage(e.target.value)}
        />
      </div>  
      <button type="submit" className="btn btn-primary w-full">Submit Request</button>
    </form>
  )
}

export default RequestPost