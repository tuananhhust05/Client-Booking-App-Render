import "./featured.css";
import useFetch from "../../hooks/useFetch"
import {url} from '../../config.js'
import AutoModeIcon from '@mui/icons-material/AutoMode';
import {useEffect,useState} from "react";
import {Link} from 'react-router-dom'
import axios from "axios";
const Featured = () => {
  const [dataHotel,setDataHotel] = useState([]);
  const [dataHotelAll,setDataHotelAll] = useState([]);
  const [openShowMore,setOpenShowMore] = useState(false);
  const [listHotelInCity,setListHotelInCity] = useState([]);
  const [openlistHotelInCity,setOpenListHotelInCity] = useState(false);
  // đã set up proxy cho app 
  const { data, loading, error } = useFetch(
    `${url()}/hotels/countByCity?cities=berlin,madrid,london`
  ); // đếm số lượng khách sạn theo thành phố 

  useEffect( () => {
    const takeData = async () =>{
      try{
        let response = await  axios.get(`${url()}/hotels/GetListCityBySortCountHotel`);
        if(response && response.data && response.data.data){
           let length = response.data.data.length;
           if(length >2){
              length = 2;
           };
           let dataHotelReceive = [];
           for(let i=0; i< length ; i++){
              dataHotelReceive.push(response.data.data[i])
           };
           setDataHotel(dataHotelReceive);
           setDataHotelAll(response.data.data);

           let arrCity = [];
           for(let i=0; i< response.data.data.length ; i++){
               arrCity.push(response.data.data[i]._id)
            };

           axios.post(`${url()}/hotels/TakeDataCity`,{listCity:arrCity}).then((response2)=>{
               if(response2 && response2.data && response2.data.data){
                    let dataCity = response2.data.data;
                    let dataFinal = [];
                    for(let i=0; i< response.data.data.length ; i++){
                        let imgLink = "";
                        if(dataCity.find((e)=> e.name == response.data.data[i]._id)){
                          imgLink = dataCity.find((e)=> e.name == response.data.data[i]._id).img;
                        }
                        let a = {
                          _id:response.data.data[i]._id,
                          count:response.data.data[i].count,
                          img:imgLink
                        };
                        dataFinal.push(a);
                    };
                    setDataHotelAll(dataFinal);
                    if(dataFinal.length > 1){
                      setDataHotel([dataFinal[0],dataFinal[1]])
                    }
                    else if(dataFinal.length == 1){
                      setDataHotel([dataFinal[0]])
                    }
                    else{
                      setDataHotel([])
                    }
               }
           }).catch((e=>{console.log(e)}))
        }
        
      }
      catch(e){
        console.log(e);
      }
    }
    takeData();
  },[]) 

  const ShowListCity = async ()=>{
    try{
      setOpenShowMore(true);
    }
    catch(e){
      console.log(e)
    }
  }
  const SeeListHotelInCity = async (city) =>{
     try{
        setOpenListHotelInCity(true);
        setOpenShowMore(false);
        axios.post(`${url()}/hotels/TakeListHotelInCity`,{city}).then((response)=>{
          console.log(response);
          if(response && response.data && response.data.data){
            setListHotelInCity(response.data.data);
          }
        }).catch((e)=>{console.log(e)});
     }
     catch(e){
        console.log(e)
     }
  }
  const BrokenImageHotel ="https://api-booking-app-aws-ec2.onrender.com/default.png";
  const imageOnErrorHotel = (event) => {
    event.currentTarget.src = BrokenImageHotel;
  };
  return (
    <div className="featured">
      
      {
        loading ? (
          <div className="loading_icon_wrapper">
              <AutoModeIcon className="loading_icon"/>
          </div>
        ):(
          <>
            {
              dataHotel.map((obj,index)=>(
                <div key={index} 
                     onClick={()=>SeeListHotelInCity(obj._id)}
                     className="featuredItem">
                    <img
                      src={obj.img}
                      alt={obj._id}
                      className="featuredImg"
                      onError={imageOnErrorHotel}
                    />
                    <div className="featuredTitles">
                      <h1>{obj._id}</h1>
                      <h2>{obj.count} properties</h2>
                    </div>
                </div>
              ))
            }
          </>
        )
      }
      <div className="ShowMore" 
           onClick={()=> ShowListCity()}
      >
        Show more...
      </div>
      {
        openShowMore && (
          <div className="form_show_more">
              {
                dataHotelAll.map((obj,index)=>(
                    <div key={index} 
                         onClick={()=>SeeListHotelInCity(obj._id)}
                         className="ele_form_show_more">
                         <img className="ele_form_show_more_img" src={obj.img} onError={imageOnErrorHotel}/>
                         <div className="ele_form_show_more_name">
                             {obj._id}
                         </div>
                    </div>
                ))
              }
          </div>
        )
      }
      {
        openlistHotelInCity && (
          <div className="list_hotel_in_city">
              {
                listHotelInCity.map((hotel,index)=>(
                    <div key={index} 
                         className="ele_form_show_more">
                         <Link style={{display:'flex'}} to={`/hotels/${hotel._id}`}>
                              <img className="ele_form_show_more_img" 
                                   onError={imageOnErrorHotel}
                                   src={(hotel && hotel.photos && (hotel.photos.length>0) && hotel.photos[0])? hotel.photos[0] :""}/>
                              <div className="ele_form_show_more_name">
                                  {hotel.name ? hotel.name : ""}
                              </div>
                         </Link>
                    </div>
                ))
              }
          </div>
        )
      }
      {
        (openShowMore || openlistHotelInCity) && (
          <div className="background_blur_feature"
               onClick={()=>{
                  setOpenShowMore(false);
                  setOpenListHotelInCity(false);
               }}
          >

          </div>
        )
      }
    </div>
  );
};

export default Featured;
