import "./hotelRecommend.scss";
import useFetch from "../../hooks/useFetch"
import {url} from '../../config.js'
import {useEffect,useState,useContext} from "react";
import {Link} from 'react-router-dom'
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
const HotelRecommend = () => {
  const { user } = useContext(AuthContext);
  const [listHotelRecomend,setListHotelRecommend] = useState([])
  useEffect(() => {
    const takeData= async()=>{ 
        axios.get(`${url()}/hotels/TakeHotelRecommend/${user._id}`).then((response)=>{
            console.log(response);
            if(response && response.data && response.data.data){
                setListHotelRecommend(response.data.data);
            }
        })
    }
    if(user){
      takeData();
    }
  },[]);
  
  return (
    <div className="hotelRecommend">
         {
            listHotelRecomend.map((obj,index)=>(
                <div key={index} className="hotelRecommend_ele_wrapper">
                   <Link to={`/hotels/${obj._id}`}>
                        <div className="hotelRecommend_ele">
                                <img src={
                                          (obj.photos && (obj.photos.length) && (obj.photos.length>0)) ? (obj.photos[0]):
                                          "https://images.squarespace-cdn.com/content/v1/5aadf482aa49a1d810879b88/1626698419120-J7CH9BPMB2YI728SLFPN/1.jpg"
                                    } 
                                    className="hotelRecommend_ele_img"/>
                                <div className="hotelRecommend_ele_name">
                                      {obj.name}
                                </div>
                          </div>
                   </Link>
                </div>
            ))
         }
    </div>
  );
};

export default HotelRecommend;