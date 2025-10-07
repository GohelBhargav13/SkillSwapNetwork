import React from 'react'

const UserRequest = ({currentState}) => {
  return (
    <>
        {currentState == "request" && (
            <p className='font-bold text-black'>This is the request page</p>
        )
        }
    </>
  )
}

export default UserRequest