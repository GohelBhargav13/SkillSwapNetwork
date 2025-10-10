import RequestPost from '../../pages/RequestPost.jsx'

const UserRequest = ({currentState}) => {
  return (
    <>
        {currentState == "request" && (
            <RequestPost />
        )
        }
    </>
  )
}

export default UserRequest