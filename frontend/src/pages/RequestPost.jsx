import React, { useState } from 'react'
import { AvailableSkills } from "../store/Skills.js"

const RequestPost = () => {

    const [userWantSkills,setUserWantSkills] = useState([])
    const [userSkillTeach,setUserSkillTeach] = useState([])

    const handleSubmit = (data) => {
        console.log("submit");
        console.log("data", data);
    }
  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 p-6 max-w-md mx-auto space-y-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-primary">Request Skill Swap</h2>

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
          multiple
          className="select select-bordered"
        >
        </select>
      </div>

      <div className="form-control">
        <label className="label">Preferred Mode</label>
        <select className="select select-bordered" required>
          <option value="">Select Mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">Additional Message</label>
        <textarea
          className="textarea textarea-bordered"
          rows={4}
          placeholder="Message (optional)"
        />
      </div>

      <div className="form-control">
        <label className="label">Availability</label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="E.g., Weekends, evenings"
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">Submit Request</button>
    </form>
  )
}

export default RequestPost