import React from 'react'
import { useAuthStore } from "../store/authStore.js"
import LogoutButton from './LogoutButton.jsx';
import { useNavigate } from 'react-router';

const Navbar = () => {
    const { authUser } = useAuthStore();


    const navigate = useNavigate();
    // custom navigator
    const Navigate = (path) => {
        navigate(path)
    }

  return (
   <div className="navbar bg-base-100 shadow-sm px-4 py-1">
      {/* Logo and Search */}
      <div className="flex-1 gap-4 flex items-center">
        <a className="btn btn-ghost p-0">
          {/* Replace with LinkedIn SVG/logo */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
            alt="LinkedIn"
            className="w-8 h-8"
          />
        </a>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-40 md:w-64"
        />
      </div>

      {/* Navbar Menu */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="flex flex-col items-center" onClick={() => Navigate("/home")}>
              <span className="material-icons">Home</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center" onClick={() => Navigate("/postview")}>
              <span className="material-icons">My Network</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center">
              <span className="material-icons">Jobs</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center">
              <span className="material-icons">Messaging</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center">
              <span className="material-icons">Notifications</span>
            </a>
          </li>
          {/* Profile/avatar */}
          <li>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-8 rounded-full">
                  <img
                    src={authUser?.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }
                    alt="Profile avatar"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
              >
                <li>
                  <a onClick={() => Navigate("/profile")}>Profile</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                 <LogoutButton>
                    <button className='border-t-secondary'>Logout</button>
                 </LogoutButton>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar