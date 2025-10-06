import React from 'react'
import { FileBadge } from "lucide-react"
const UserPost = ({userPosts}) => {
    console.log(userPosts)
  return (
    <>
        <p className='font-bold text-lg text-yellow-500'>User posts are</p>
        {userPosts.length > 0 && userPosts.map((post) => (
            <li key={post._id} className='font-bold text-black'>
            <div className='flex flex-col'>
            <FileBadge className='w-6 h-6' />
                <p>{post.title}</p>
                <p>{post.description}</p>
                </div>
            </li>
        ))}
    </>
  )
}

export default UserPost