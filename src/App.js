import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {useContext} from "react";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Single from "./pages/single/Single";
import Singleuser from "./pages/singleuser/Singleuser";
import Post from './pages/post/Post';
import { AuthContext } from "./context/AuthContext";
import {socketCient} from './config.js'
import {useEffect} from 'react'

function App() {
  const {user} = useContext(AuthContext);
  let socket = socketCient();
  useEffect(() => {
    if(user && user._id){
      socket.emit("login",user._id)
    }
  },[user,socket])// liệt kê dependency sử dụng 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {user? <Home/>:<Login/>}/>
        <Route path="/hotels" element= {user? <List/>:<Login/>}/>
        {/* link dẫn tới chi tiết từng khách sạn  */}
        <Route path="/hotels/:id" element={user? <Hotel/>:<Login/>}/> 
        <Route path="/rooms/:id" element={user? <Single/>:<Login/>}/> 
        <Route path="/users/:id" element={user? <Singleuser/>:<Login/>}/>
        <Route path="/posts/:id" element={user? <Post/>:<Login/>}/>
        <Route path="/login" element={<Login/>}/> 
        <Route path="/register" element={<Register/>}/> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
