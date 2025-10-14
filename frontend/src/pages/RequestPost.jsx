import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { socket } from "../Server.js"
import { useAuthStore } from "../store/authStore.js"

const RequestPost = () => {
  const [userWantSkills, setUserWantSkills] = useState([]);
  const [userSkillTeach, setUserSkillTeach] = useState([]);
  const [AdditionalMessage, setAdditionalMessage] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const { authUser } = useAuthStore();

  useEffect(() => {

    socket.on("newRequest",({message}) => {
         if(message) toast.success(message)
    })

  },[])

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      title: userTitle,
      wantSkills: userWantSkills,
      offerSkills: userSkillTeach,
    };

    console.log("submit");
    console.log("data", data);

    try {

      // Emit the socket Event
        socket.emit("newRequest",{ data,authUser })

    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setUserSkillTeach([]);
      setAdditionalMessage("");
      setUserWantSkills([]);
      setUserTitle("");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 max-w-md w-full mx-auto rounded-xl shadow-lg border border-base-300/70 px-8 py-7 mt-16"
    >
      <h2 className="text-[1.6rem] font-bold text-base-content mb-7 text-center tracking-tight">
        Request Skill Swap
      </h2>

      <label className="block text-base font-medium text-base-content/80 mb-2 mt-2">
        Enter a Title
      </label>
      <input
        type="text"
        value={userTitle}
        onChange={(e) => setUserTitle(e.target.value)}
        className="w-full rounded-md border border-base-300/60 bg-[#20222f] text-base-content py-2 px-4 mb-5 focus:outline-none focus:ring-2 focus:ring-[#8070f8] font-normal"
        placeholder="Add a short headline"
      />

      <label className="block text-base font-medium text-base-content/80 mb-2">
        Skills You Want to Learn
      </label>
      <select
        className="w-full rounded-md border border-base-300 bg-[#20222f] text-base-content px-4 py-2 mb-5"
        onChange={(e) => {
          if (e.target.value === "Select Skill") return;
          if (!userWantSkills.includes(e.target.value)) {
            setUserWantSkills([...userWantSkills, e.target.value]);
          }
        }}
        value={userWantSkills}
      >
        <option value="Select Skill">Select Skill</option>
        <option value="React Js">React Js</option>
        <option value="Express Js">Express Js</option>
        <option value="Core Java">Core Java</option>
        <option value="MongoDB">MongoDB</option>
        <option value="PHP">PHP</option>
        <option value="Node Js">Node Js</option>
        <option value="JWT">JWT</option>
      </select>

      <label className="block text-base font-medium text-base-content/80 mb-2">
        Skills You Can Offer (optional)
      </label>
      <select
        className="w-full rounded-md border border-base-300 bg-[#20222f] text-base-content px-4 py-2 mb-5"
        onChange={(e) => {
          if (e.target.value === "Select Skill") return;
          if (!userSkillTeach.includes(e.target.value)) {
            setUserSkillTeach([...userSkillTeach, e.target.value]);
          }
        }}
        value={userSkillTeach}
      >
        <option value="Select Skill">Select Skill</option>
        <option value="Node Js">Node Js</option>
        <option value="React Js">React Js</option>
        <option value="PHP">PHP</option>
        <option value="Core Java">Core Java</option>
      </select>

      <label className="block text-base font-medium text-base-content/80 mb-2">
        Additional Message
      </label>
      <textarea
        value={AdditionalMessage}
        onChange={(e) => setAdditionalMessage(e.target.value)}
        placeholder="Message (optional)"
        rows={4}
        className="w-full rounded-md border border-base-300 bg-[#20222f] text-base-content px-4 py-2 mb-6 font-normal"
      />

      <button
        type="submit"
        className="w-full bg-[#2a1d8d] text-white font-semibold text-[1rem] py-2 rounded-md shadow-md hover:bg-[#6356c1] transition-all duration-150"
      >
        Submit Request
      </button>
    </form>
  );
};

export default RequestPost;
