import React from 'react'
import { useAuthStore } from "../store/authStore.js" 

const LogoutButton = ({children}) => {
    const { userLogout } = useAuthStore();
    const handleLogout = async() => {
        await userLogout();
    }

  return (
    <button className='btn btn-primary' onClick={handleLogout}>
        {console.log("children", children)}
        {children}
    </button>
  )
}

export default LogoutButton