import "./navbar.css";

import { Link } from "react-router-dom";
import {useContext } from "react";
// import {useSelector} from 'react-redux'
// import{SearchDataSelector} from '../../redux/selector' // mỗi lần dịch là thay đổi folder cha hiện tại 
import { AuthContext } from "../../context/AuthContext";
// import {url} from '../../config.js'
// import {socketCient} from '../../config.js'
const NavBar = () => {
  
  const { user } = useContext(AuthContext);
  const BrokenImage ="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png";
  const imageOnError = (event) => {
    event.currentTarget.src = BrokenImage;
    event.currentTarget.className = "userInfor_img";
  };
  return (
    <div className ="navbar">
       <div className="navContainer">
            <div className="logo">
                Travel Community 
            </div>
            <Link className="userInfor_wrapper" to={`/users/${user._id}`}>
                <div className="userInfor">
                    <div className="userInfor_img">
                        <img 
                             onError={imageOnError}
                             className="userInfor_img" 
                             src={user.img} 
                             alt={user.username}/>
                    </div>
                    <div className="userInfor_name">
                        {user.username}
                    </div>
                </div>
            </Link>
       </div>
    </div>
  );
};

export default NavBar;