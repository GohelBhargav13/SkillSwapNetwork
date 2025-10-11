import React from 'react'
import { axiosInstance } from "../../libs/axios.js"
import { useEffect } from 'react'
const Allinprogress = () => {

    // State for the posts
    const [posts, setPosts] = useState([]);

    // fetch the data of the user with the in_progress posts
    useEffect(() => {
        try {

            axiosInstance.get("/skillswap/inProgress")
                .then((res) => {
                    console.log("Posts Data of in_progress", res.data)

                })            
        } catch (error) {
            
        }
    },[])


  return (
    <div>Allinprogress</div>
  )
}

export default Allinprogress