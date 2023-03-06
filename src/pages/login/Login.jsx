import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import {url} from '../../config.js'
const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" }); 
    try {
      const res = await axios.post(`${url()}/auth/loginmail`, credentials);
      if(res &&res.data && res.data.details){
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });  
      }
      navigate("/")
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data }); 
    }
  };

  const handleRequestRegister =()=>{
    navigate("/register")
  }
  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        <button onClick={handleRequestRegister} className="lButton">
          Register
        </button>
        {error && <span>{error.message}</span>}
      </div>
      <img src="https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
           className="img_background_login" alt=""/>
    </div>
  );
};

export default Login;