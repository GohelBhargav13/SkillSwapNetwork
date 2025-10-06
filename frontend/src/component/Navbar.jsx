import React, { useState } from 'react';
import { useAuthStore } from "../store/authStore.js";
import LogoutButton from './LogoutButton.jsx';
import { useNavigate } from 'react-router';
import { TabletSmartphone } from "lucide-react"
import Button from './StylesElements/Button.jsx';

const Navbar = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);


  // custom navigator
  const Navigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 py-1">
      {/* Logo and Search */}
      <div className="flex-1 flex items-center gap-4">
        <a className="btn btn-ghost p-0 min-w-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
            alt="LinkedIn"
            className="w-8 h-8"
          />
        </a>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-40 md:w-64 hidden sm:block"
        />
        <Button>
          <span className="font-bold text-white">Search</span>
        </Button>
      </div>
      
      {/* Mobile Hamburger */}
      <div className="flex-none md:hidden">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <TabletSmartphone />
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="flex-none hidden md:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="flex flex-col items-center" onClick={() => Navigate("/home")}>
              <span className="material-icons">Home</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center">
              <span className="material-icons">Group</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center">
              <span className="material-icons">Work</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center">
              <span className="material-icons">Chat</span>
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
                    src={authUser?.image || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
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
                <li><a>Settings</a></li>
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

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-base-100 rounded-box shadow-lg p-4 z-50 w-60 md:hidden">
          <ul className="menu menu-vertical">
            <li>
              <a className="flex items-center" onClick={() => Navigate("/home")}>
                <span className="material-icons mr-2"></span> Home
              </a>
            </li>
            <li>
              <a className="flex items-center" onClick={() => Navigate("/postview")}>
                <span className="material-icons mr-2"></span> My Network
              </a>
            </li>
            <li>
              <a className="flex items-center">
                <span className="material-icons mr-2"></span> Jobs
              </a>
            </li>
            <li>
              <a className="flex items-center">
                <span className="material-icons mr-2"></span> Messaging
              </a>
            </li>
            <li>
              <a className="flex items-center">
                <span className="material-icons mr-2"></span> Notifications
              </a>
            </li>
            <li className="mt-2 border-t pt-2">
              <a className="flex items-center" onClick={() => Navigate("/profile")}>
                <span className="material-icons mr-2"></span> Profile
              </a>
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
      )}
    </div>
  );
};

export default Navbar;
