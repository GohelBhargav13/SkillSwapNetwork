import React from 'react'

const Button = ({children}) => {
  return (
    <button className='btn btn-primary w-[100px]'>
        {children}
    </button>
  )
}

export default Button