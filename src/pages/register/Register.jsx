import axios from "axios";
import { useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./register.css";
import {url} from '../../config.js'
const Register = () => {
  const [credentials, setCredentials] = useState({
    country:"",
    city:"",
    phone:"",
    username: undefined,
    email: undefined,
    password: undefined,
    confirm_password: undefined
  });
  const [err, setErr] = useState(false);
  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value })); // giữ nguyên các giá trị, chỉ thay đổi giá trị trong trường được chỉ định
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if((credentials.username)&&(credentials.password)&&(credentials.confirm_password)
        &&(credentials.city)&&(credentials.phone)&&(credentials.country)
        &&(credentials.email)&&(String(credentials.password)===String(credentials.confirm_password))){
        const res = await axios.post(`${url()}/auth/register`,
          {
            username:credentials.username,
            email:credentials.email,
            img:"https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png",
            city:credentials.city,
            country:credentials.country,
            phone:credentials.phone,
            password:credentials.password,
          }
        );
        if(res &&(res.data)&&(res.data.success)){
          const res2 = await axios.post(`${url()}/auth/loginmail`, {email:credentials.email,password:credentials.password});
          if(res2 &&res2.data && res2.data.details){
              dispatch({ type: "LOGIN_SUCCESS", payload: res2.data.details }); 
              navigate("/"); 
          }
          else{
              navigate("/login");
          }
        }
        else{
            setErr(true)
        }
    }
    else{
        setErr(true);
    }
  };
  
  return (
    <div className="login">
      <div className="lContainer">
        <input
            type="text"
            placeholder="country"
            id="country"
            onChange={handleChange}
            className="lInput"
        />
        <input
            type="text"
            placeholder="city"
            id="city"
            onChange={handleChange}
            className="lInput"
        />
        <input
            type="text"
            placeholder="phone"
            id="phone"
            onChange={handleChange}
            className="lInput"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
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
         <input
          type="password"
          placeholder="confirm password"
          id="confirm_password"
          onChange={handleChange}
          className="lInput"
        />
        <button onClick={handleClick} className="lButton">
          Register
        </button>
        {err && <span>Đăng ký không thành công, vui lòng thử lại</span>}
      </div>
    </div>
  );
};

export default Register;