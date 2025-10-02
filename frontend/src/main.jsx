import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter,Router,Route,Routes } from "react-router"
import './index.css'
import App from './App.jsx'
import SingUp from './component/SingUp.jsx'
import Login from './component/Login.jsx'
import Profile from './component/Profile.jsx'
import Verify from './component/Verify.jsx'
import PostView from './component/PostView.jsx'
import LeaderBoard from './component/LeaderBoard.jsx'
import CreatePost from './component/Post/CreatePost.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <Routes>
    <Route path='/' element={ <App /> } />
    <Route path='/register' element={ <SingUp /> } />
    <Route path='/login' element={ <Login /> } />
    <Route path='/profile' element={ <Profile /> } />
    <Route path='/verify-email/:token' element={ <Verify /> } />
    <Route path='/home' element={ <PostView /> } />
    <Route path='/leaderboard' element={ <LeaderBoard /> } />
    <Route path='/createpost' element={ <CreatePost /> } />
    
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
