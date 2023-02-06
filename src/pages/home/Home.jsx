import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import HotelRecommend from "../../components/hotelRecommend/hotelRecommend";
import "./home.css";
import {url} from '../../config.js'
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {useContext,useEffect} from "react";
import axios from "axios";
const Home = () => {
  const navigate = useNavigate()
  const {user} = useContext(AuthContext);
  // verify lại dữ liệu đăng nhập; check data 
  useEffect( () => {
    const checkToken = async () =>{
      try{
        let check = await  axios.put(`${url()}/users/check/${user._id}`,{token:user.token});
        if(check && check.data && check.data.check && user && user._id){
          console.log("Login successfully")
        }
        else{
          navigate("/login");
        }
        
      }
      catch(e){
        console.log(e);
      }
    }
    checkToken();
  },[user,navigate]) // đoạn thêm dependency này mới 
  return (
    <div>
      <Navbar />
      <Header/>
      <div className="homeContainer">
        <Featured/>
        <PropertyList/>
        <FeaturedProperties/>
        <HotelRecommend/>
        <MailList/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
