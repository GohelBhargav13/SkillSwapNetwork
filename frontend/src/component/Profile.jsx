import React from "react";
import { useAuthStore } from "../store/authStore.js"
const Profile = () => {
  const { authUser } = useAuthStore();
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-md shadow-md overflow-hidden">
      
      {/* Cover Banner */}
      <div className="relative h-48 bg-black">
        <img
          alt="Banner"
          className="w-full h-full object-cover"
          src={authUser.bannerImage || "https://placehold.co/1200x200/000000/ffffff"}
        />
        {/* Profile avatar */}
        <div className="absolute bottom-0 left-10 translate-y-1/2">
          <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-300">
            <img
              alt="User avatar"
              src={authUser.avatar || "https://placehold.co/128x128/cccccc/000000?text=User+avatar"}
              className="w-full h-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 m-1 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6 21H3v-3L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* User Info (Name, headline, location, verification badge and university) */}
      <div className="px-16 pt-16 pb-6 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{authUser.name}</h1>
          <p className="text-gray-600 text-lg mt-1">{authUser.pronouns}</p>
          <div className="flex flex-wrap items-center space-x-4 mt-1">
            <p className="text-gray-600">{authUser.headline}</p>
          </div>
          <p className="text-gray-600 mt-2">{authUser.location}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button className="btn btn-primary">Open to</button>
          <button className="btn btn-outline btn-sm">Add profile section</button>
          <button className="btn btn-outline btn-sm">Enhance profile</button>
          <button className="btn btn-outline btn-sm">Resources</button>
        </div>
      </div>

      {/* Suggested For You (as an example section) */}
      <section className="px-16 py-8 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-black">Suggested for you</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 max-w-full">
          {/* Example suggestion cards here */}
          <div className="card bg-white shadow p-4 rounded">
            <p className="font-semibold text-black">Add a profile photo to help others recognize you</p>
          </div>
          <div className="card bg-white shadow p-4 rounded">
            <p className="font-semibold text-black">Write a summary to highlight your professional skills</p>
          </div>
        </div>
      </section>

      {/* Right side sections can be separate components */}
      {/* They can be placed in a sidebar as per your design */}
    </div>
  );
};

export default Profile;
