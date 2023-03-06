import "./post.scss";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import PostEle from "../../components/postele/PostEle";
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import HotelIcon from '@mui/icons-material/Hotel';
import TitleIcon from '@mui/icons-material/Title';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RawOnIcon from '@mui/icons-material/RawOn';
import CloseIcon from '@mui/icons-material/Close';
import MoodIcon from '@mui/icons-material/Mood';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import AutoModeIcon from '@mui/icons-material/AutoMode';
import { useLocation} from "react-router-dom";
import axios from 'axios'
import { useEffect, useState,useContext } from "react";
import { useDropzone } from "react-dropzone"
import {useSelector} from 'react-redux'
import{SearchDataSelector} from '../../redux/selector' // mỗi lần dịch là thay đổi folder cha hiện tại 
import { AuthContext } from "../../context/AuthContext";
import {url} from '../../config.js'
// import {socketCient} from '../../config.js'
import {BottomScrollListener} from 'react-bottom-scroll-listener';
const Post = () => {
  // let socket = socketCient();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2]; // lấy id truyền vào bằng đường link từ components search 
  // const path = location.pathname.split("/")[1];
  const [loading,setLoading] = useState(true);
  const [listPost,setListPost] = useState([]);
  const [mode,setMode] = useState("");
  const [idChooseEdit,setIdChooseEdit] = useState("");
  const [listInput,setListInput] = useState([{id:0,content:""}]);
  const [title,setTitle] = useState("");
  const [openFormToCreatePost,setOpenFormToCreatePost] = useState(false);
  const [listFileCreatePost,setListFileCreatePost] = useState([]);
  const [openFormPostTitle,setOpenFormPostTitle] = useState(false);
  const [openFormHotelRecommend,setOpenFormHotelRecommend] = useState(false);
  const [hotelRecommend,setHotelRecommend] = useState("");
  const [openFormCityRecommend,setOpenFormCityRecommend] = useState(false);
  const [cityRecommend,setCityRecommend] = useState("");
  const [openFormSiteRecommend,setOpenFormSieRecommend] = useState(false);
  const [siteRecommend,setSiteRecommend] = useState("");
  const [openRawSeen,setOpenRawSeen] = useState(false);
  const [rawSeen,setRawSeen] = useState("Personal");
  const [openEmotionAuthorForm,setOpenEmotionAuthorForm] = useState(false);
  const [emotionAuthor,setEmotionAuthor] = useState("happy");
  const [openUserTagForm,setOpenUserTagForm] = useState(false);
  const [findWordUserTag,setFindWordUserTag] = useState("");
  const [listUserTag,setListUserTag] = useState([]);
  const [listUserChooseTag,setListUserChooseTag] = useState([]);
  
  // Load posts 
  const [listPostIdBaned,setListPostIdBaned]=useState([]);
  const [listPostIdBanedScroll,setListPostIdBanedScroll]=useState([]);

  // state for load posts base on CityName ; CityName is taken by history Order
  const [skipStateCityName,setSkipStateCityName] = useState(0);
  const [stopLoadPostCityNameOrder,setStopLoadPostCityNameOrder] = useState(false);
  
  // state for load posts base on HotelName ; HotelName is taken by history Order
  const [skipStateHotelName,setSkipStateHotelName] = useState(0);
  const [stopLoadPostHotelNameOrder,setStopLoadPostHotelNameOrder] = useState(false);
  
  // state for load post random list user baned 
  const [skipStateLoadPostRandom,setSkipStateLoadPostRandom]= useState(0);
  const [stopLoadPostRandomPostBan,setStopLoadPostRandomPostBan] = useState(false);
  const Data = useSelector(SearchDataSelector);
  useEffect(() => {
    const takeData= async ()=>{

          let arrayIdBaned = [];
          // console.log(listPostIdBaned);
          // load by cityName 
          let response = await axios.post(`${url()}/posts/GetListPost/HistoryOrder`,{history:Data.listOrder,skip:skipStateCityName})
          // console.log("Dữ liệu bài post dựa trên dữ liệu cityName; CityName lấy từ historyOrder",response);
          if(response && response.data && response.data.data){
            setSkipStateCityName(response.data.data.length);
            for(let i = 0; i < response.data.data.length;i++){
                arrayIdBaned.push(response.data.data[i]._id);
                setListPost((current)=>[...current, response.data.data[i]])
            }
            if(response.data.data.length < 5){
                setStopLoadPostCityNameOrder(true);
                // console.log("Dừng load bài post luồng city name ; order");
            }
            else{
                setStopLoadPostCityNameOrder(false);
            }
          }

          // load by HotelName 
          let arrayHotelName = [];
          for(let i = 0; i <Data.listOrder.length;i++){
              arrayHotelName.push(Data.listOrder[i].HotelName)
          }
          let response2 = await axios.post(`${url()}/posts/GetListPostByHotelName/HistoryOrder`,
             {HotelNames:arrayHotelName,skip:skipStateHotelName}
          )
          if(response2 && response2.data && response2.data.data){
            setSkipStateHotelName(response2.data.data.length);
            for(let i = 0; i < response2.data.data.length;i++){
                arrayIdBaned.push(response2.data.data[i]._id);
                setListPost((current)=>[...current, response2.data.data[i]])
            }
            if(response2.data.data.length < 5){
              setStopLoadPostHotelNameOrder(true);
              // console.log("Dừng load bài post luồng hotel name ; order");
            }
            else{
                  setStopLoadPostCityNameOrder(false);
              }
          };

          // random 
          let response3 = await axios.post(`${url()}/posts/GetListPostRanDomListPostBaned/HistoryOrder`,{
            ListPostBaned:arrayIdBaned,
            skip:skipStateLoadPostRandom
          })
          // console.log("bài post luồng random",response3.data.data);
          setLoading(false);
          if(response3 && response3.data && response3.data.data && response3.data.data.length && (response3.data.data.length>0)){
            if(response3.data.data.length < 5){
                // console.log("Dừng luồng random",response3.data.data.length);
                setStopLoadPostRandomPostBan(true);
            }
            else{
                  setStopLoadPostRandomPostBan(false);
            }
            setSkipStateLoadPostRandom(response3.data.data.length);
            for(let i = 0; i < response3.data.data.length;i++){
                arrayIdBaned.push(response3.data.data[i]._id);
                setListPost((current)=>[...current, response3.data.data[i]])
            };
          }

          arrayIdBaned =  [...new Map(arrayIdBaned.map((item) => [item, item])).values()];
          setListPostIdBaned(arrayIdBaned);
          setListPostIdBanedScroll(arrayIdBaned);
      }
    try{
      takeData();
    }
    catch(e){
      console.log(e);
    }
  },[Data.listOrder,listPostIdBaned,skipStateCityName,skipStateHotelName,skipStateLoadPostRandom])
  

  const handleChangeMode = async (mode)=>{
    try{
        if(String(mode) === "My Post"){
          axios.get(`${url()}/posts/GetListPostByUserId/${id}`).then((res)=>{
            if(res && res.data && res.data.data){
                setListPost(res.data.data);
                
                // trả ra điểm khởi đầu 
                setListPostIdBaned([]);
                setListPostIdBanedScroll([]);
                setSkipStateCityName(0);
                setSkipStateHotelName(0);
                setSkipStateLoadPostRandom(0);
            }
          }).catch((e)=>{
           console.log(e)
          })
        }
        else if(String(mode) === "Random"){
           // load lại như lúc ban đầu 

          setListPost([]);

          let arrayIdBaned = [];
          // load by cityName 
          let response = await axios.post(`${url()}/posts/GetListPost/HistoryOrder`,{history:Data.listOrder,skip:skipStateCityName})
          // console.log("Dữ liệu bài post dựa trên dữ liệu cityName; CityName lấy từ historyOrder",response);
          if(response && response.data && response.data.data){
            setSkipStateCityName(response.data.data.length);
            for(let i = 0; i < response.data.data.length;i++){
                arrayIdBaned.push(response.data.data[i]._id);
                setListPost((current)=>[...current, response.data.data[i]])
            }
            if(response.data.data.length < 5){
                setStopLoadPostCityNameOrder(true);
                // console.log("Dừng load bài post luồng city name ; order");
            }
            else{
                setStopLoadPostCityNameOrder(false);
            }
          }

          // load by HotelName 
          let arrayHotelName = [];
          for(let i = 0; i <Data.listOrder.length;i++){
              arrayHotelName.push(Data.listOrder[i].HotelName)
          }
          let response2 = await axios.post(`${url()}/posts/GetListPostByHotelName/HistoryOrder`,
             {HotelNames:arrayHotelName,skip:skipStateHotelName}
          )
          if(response2 && response2.data && response2.data.data){
            setSkipStateHotelName(response2.data.data.length);
            for(let i = 0; i < response2.data.data.length;i++){
                arrayIdBaned.push(response2.data.data[i]._id);
                setListPost((current)=>[...current, response2.data.data[i]])
            }
            if(response2.data.data.length < 5){
              setStopLoadPostHotelNameOrder(true);
              // console.log("Dừng load bài post luồng hotel name ; order");
            }
            else{
                  setStopLoadPostCityNameOrder(false);
              }
          };

          // random 
          let response3 = await axios.post(`${url()}/posts/GetListPostRanDomListPostBaned/HistoryOrder`,{
            ListPostBaned:arrayIdBaned,
            skip:skipStateLoadPostRandom
          })
          // console.log("bài post luồng random",response3.data.data);
          setLoading(false);
          if(response3 && response3.data && response3.data.data && response3.data.data.length && (response3.data.data.length>0)){
            if(response3.data.data.length < 5){
                // console.log("Dừng luồng random",response3.data.data.length);
                setStopLoadPostRandomPostBan(true);
            }
            else{
                  setStopLoadPostRandomPostBan(false);
            }
            setSkipStateLoadPostRandom(response3.data.data.length);
            for(let i = 0; i < response3.data.data.length;i++){
                arrayIdBaned.push(response3.data.data[i]._id);
                setListPost((current)=>[...current, response3.data.data[i]])
            };
          }

          arrayIdBaned =  [...new Map(arrayIdBaned.map((item) => [item, item])).values()];
          setListPostIdBaned(arrayIdBaned);
          setListPostIdBanedScroll(arrayIdBaned);
        }
    }
    catch(e){
       console.log(e)
    }
  }
  const handleAddInput = ()=>{
    try{
      setListInput(current => [...current,{id:listInput.length+1,content:""}]);
    }
    catch(e){
      console.log(e)
    }
  }
  
  const EditListState = (id,Content) => {
    const newState = listInput.map(obj => {
      if (String(obj.id) === String(id)) {
        return Content;
      }
      return obj;
    });
    setListInput(newState);
  };

  const handleChangeInputEle = (id,value)=>{
    try{
       let newObj = { id:id,content:value};
       EditListState(id,newObj)
    }
    catch(e){
      console.log(e)
    }
  }
  const handlePost = ()=>{
    try{
       if(String(mode) === "edit"){
            let content = [];
            for(let i=0; i<listInput.length; i++){
              if(listInput[i].content){
                content.push(listInput[i].content)
              }
            };
            let post = {
              PostId:idChooseEdit,
              Title:title,
              Content:content,
              ListImg:listFileCreatePost,
              HotelRecommend: (String(hotelRecommend).trim() !== "") ? (String(hotelRecommend).split(",")) : [],
              CityRecommend:(String(cityRecommend).trim() !== "") ? (String(cityRecommend).split(",")) : [], 
              SiteRecommend:(String(siteRecommend).trim() !== "") ? (String(siteRecommend).split(",")) : [], 
              EmotionAuthor:emotionAuthor,
              PermissionSeen:rawSeen,
              ListPeopleTag:listUserChooseTag
            }
            
            // call api 
            axios.post(`${url()}/posts/EditPost`,post).catch((e)=>{
              console.log(e);
            })
            // console.log("Dữ liệu edit đẩy lên",post);
            // update State 
            const newState = listPost.map(ele => {
              if (String(ele._id) === String(idChooseEdit)) {
                return { ...ele, 
                          Title:title,
                          Content:content,
                          ListImg:listFileCreatePost,
                          HotelRecommend: (String(hotelRecommend).trim() !== "") ? (String(hotelRecommend).split(",")) : [],
                          CityRecommend:(String(cityRecommend).trim() !== "") ? (String(cityRecommend).split(",")) : [], 
                          SiteRecommend:(String(siteRecommend).trim() !== "") ? (String(siteRecommend).split(",")) : [],
                        };
              }
              return ele;
            });
            setListPost(newState);
            setOpenFormToCreatePost(false);
            setListInput([{id:0,content:""}]);
            setTitle("");
            setListFileCreatePost([]);
            setHotelRecommend("");
            setCityRecommend("");
            setSiteRecommend("");
            setRawSeen("Personal");
            setEmotionAuthor("happy");
            setListUserChooseTag([]);
            setMode("");
       }
       else{
            let content = [];
            for(let i=0; i<listInput.length; i++){
              if(listInput[i].content){
                content.push(listInput[i].content)
              }
            };
            
            let post = {
              UserId: user._id,
              UserName:user.username,
              LinkImgUserCreate:user.img,
              Title:title,
              Content:content,
              ListImg:listFileCreatePost,
              HotelRecommend: (String(hotelRecommend).trim() !== "") ? (String(hotelRecommend).split(",")) : [],
              CityRecommend:(String(cityRecommend).trim() !== "") ? (String(cityRecommend).split(",")) : [], 
              SiteRecommend:(String(siteRecommend).trim() !== "") ? (String(siteRecommend).split(",")) : [], 
              EmotionAuthor:emotionAuthor,
              PermissionSeen:rawSeen,
              ListPeopleTag:listUserChooseTag
            }
            // console.log("Dữ liệu bài post",post);
            axios.post(`${url()}/posts/CreatePost`,post).then((response)=>{
              if(response && response.data && response.data.data){
                setListPost((current)=>[response.data.data,...current])
              }
            })
            .catch((e)=>{console.log(e)})
            setOpenFormToCreatePost(false);
            setListInput([{id:0,content:""}]);
            setTitle("");
            setListFileCreatePost([]);
            setHotelRecommend("");
            setCityRecommend("");
            setSiteRecommend("");
            setRawSeen("Personal");
            setEmotionAuthor("happy");
            setListUserChooseTag([]);
       }
    }
    catch(e){
       console.log(e)
    }
  }
  const handleOutCreatePost = ()=>{
    setListInput([{id:0,content:""}]);
    setTitle("");
    for(let i=0; i< listFileCreatePost.length; i++){
        axios.post(`${url()}/hotels/DeleteFile`,{ImgLink:listFileCreatePost[i]}).catch((e)=>{console.log(e)})
    }
    setListFileCreatePost([]);
    setHotelRecommend("");
    setCityRecommend("");
    setSiteRecommend("");
    setRawSeen("Public");
    setEmotionAuthor("happy");
    setListUserChooseTag([]);
    setMode("");
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (accceptedFiles)=>{
        const formData = new FormData();
        const listType = ["img","jpg","jpeg","png","gif","tiff"]
        const config = {
            header: { 'Content-Type': 'multipart/form-data' }
        }
        accceptedFiles.forEach(pic => {
          let type = String(pic.path).split(".")[String(pic.path).split(".").length-1].toLowerCase();
          if(listType.find((e)=> String(e) === type)){
            formData.append("files",pic);
          }
        });
        
        axios.post(`${url()}/hotels/UpLoadFile`, formData, config)
        .then(response => {
          if (response && response.data && response.data.data) {
             for(let i=0; i<response.data.data.length; i++) {
                setListFileCreatePost(current => [...current,response.data.data[i]])
             }
          }
        })
        
    }
  }); 

  const handleTypeRecommendItem = (content)=>{
    try{
       if(openFormHotelRecommend){
          setHotelRecommend(content);
       }
       else if(openFormCityRecommend){
          setCityRecommend(content);
       }
       else if(openFormSiteRecommend){
          setSiteRecommend(content);
       }
    }
    catch(e){
      console.log(e)
    }
  }
  const handleCloseRecommednForm = ()=>{
    try{
      if(openFormHotelRecommend){
         setOpenFormHotelRecommend(false)
      }
      else if (openFormCityRecommend){
         setOpenFormCityRecommend(false)
      }
      else if(openFormSiteRecommend){
         setOpenFormSieRecommend(false);
      }
    }
    catch(e){
      console.log(e)
    }
  }
  // set up thời gian ngừng gõ mới call api 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        axios.post(`${url()}/users/FindUser`,{
          userId:user._id,
          message:findWordUserTag
        }).then((response)=>{
          if(response && response.data && response.data.data){
             setListUserTag(response.data.data)
          }
        }).catch((e)=>{console.log(e)})
    },500)
    return () => clearTimeout(delayDebounceFn)
  }, [findWordUserTag,user._id]);
  
  const BrokenImageHotel ="https://api-booking-app-aws-ec2.onrender.com/default.png";
  const imageOnErrorHotel = (event) => {
    event.currentTarget.src = BrokenImageHotel;
  };
  const handleChooseUserTag = (obj)=>{
    try{
      if(String(mode) === "edit"){
        if(obj && obj.userId && ( String(obj.userId) !== String(user._id)) && (!listUserChooseTag.find((e)=> String(e.userId) === String(obj.userId))) ){
                setListUserChooseTag(current => [...current,obj]);
                axios.post(`${url()}/posts/TagUser`,{
                   PostId:idChooseEdit,
                   userId:obj.userId,
                   username:obj.username,
                   img:obj.img
                }).catch((e)=>{console.log(e)});
                // set up state ui 
                const newState = listPost.map(ele => {
                  if (String(ele._id) === String(idChooseEdit)) {
                    return { ...ele, ListPeopleTag:ele.ListPeopleTag.concat(obj)};
                  }
                  return ele;
                });
                setListPost(newState);
        }
      }
      else{
        if(obj && obj.userId && (String(obj.userId) !== user._id) && (!listUserChooseTag.find((e)=> String(e.userId) === String(obj.userId))) ){
                setListUserChooseTag(current => [...current,obj])
        }
      }
    }
    catch(e){
      console.log(e)
    }
  }
  const handleDeleteChooseUserTag = (obj)=>{
      try{
        if(String(mode) === "edit"){
          setListUserChooseTag(listUserChooseTag.filter((e)=> String(e.userId) !== String(obj.userId)));
          axios.post(`${url()}/posts/UnTagUser`,{
            PostId:idChooseEdit,
            userId:obj.userId,
          }).catch((e)=>{console.log(e)});
          const newState = listPost.map(ele => {
            if (String(ele._id) === String(idChooseEdit)) {
              return { ...ele, ListPeopleTag:ele.ListPeopleTag.filter((e)=> String(e.userId) !== String(obj.userId))};
            }
            return ele;
          });
          setListPost(newState);
        }
        else{
          setListUserChooseTag(listUserChooseTag.filter((e)=> String(e.userId) !== String(obj.userId)))
        }
      }
      catch(e){
        console.log(e)
      }
  }

  const handleCancelUpload = (obj)=>{
    try{
      if(String(mode) === "edit"){
        setListFileCreatePost(listFileCreatePost.filter((e)=> String(e) !== String(obj)));
        axios.post(`${url()}/hotels/DeleteFile`,{ImgLink:obj}).catch((e)=>{console.log(e)});

        const newState = listPost.map(ele => {
          if (String(ele._id) === String(idChooseEdit)) {
            return { ...ele, 
                     ListImg:ele.ListImg.filter((e)=> String(e) !== String(obj))};
          }
          return ele;
        });
        setListPost(newState);
        axios.post(`${url()}/posts/DeleteFilePost`,{PostId:idChooseEdit,ImgLink:obj}).catch((e)=>{console.log(e)})
      }
      else{
        setListFileCreatePost(listFileCreatePost.filter((e)=> String(e) !== String(obj)));
        axios.post(`${url()}/hotels/DeleteFile`,{ImgLink:obj}).catch((e)=>{console.log(e)});
      }
    }
    catch(e){
        console.log(e);
    }
  }
  
  const handleBotton = async ()=>{
    try{
       console.log("Bottom");
       let arrayIdBaned = listPostIdBanedScroll;

       if(stopLoadPostHotelNameOrder){
          console.log("Dừng luồng tên khách sạn")
       }
       else{
            let arrayHotelName = [];
            for(let i = 0; i <Data.listOrder.length;i++){
                arrayHotelName.push(Data.listOrder[i].HotelName)
            }
            let response2 = await axios.post(`${url()}/posts/GetListPostByHotelName/HistoryOrder`,
              {HotelNames:arrayHotelName,skip:skipStateHotelName}
            )
            if(response2 && response2.data && response2.data.data){
                  setSkipStateHotelName(skipStateHotelName + response2.data.data.length);
                  for(let i = 0; i < response2.data.data.length;i++){
                      arrayIdBaned.push(response2.data.data[i]._id);
                      setListPost((current)=>[...current, response2.data.data[i]])
                  }
                  if(response2.data.data.length < 5){
                    setStopLoadPostHotelNameOrder(true);
                    // console.log("Dừng load bài post luồng hotel name ; order");
                  }
                  else{
                        setStopLoadPostCityNameOrder(false);
                  }
            };
       }

       if(stopLoadPostCityNameOrder){
          //  console.log("Dừng luồng tên thành phố")
       }
       else{
              // load by cityName 
              let response = await axios.post(`${url()}/posts/GetListPost/HistoryOrder`,{history:Data.listOrder,skip:skipStateCityName})
              // console.log("Dữ liệu bài post dựa trên dữ liệu cityName; CityName lấy từ historyOrder",response);
              if(response && response.data && response.data.data){
                setSkipStateCityName(skipStateCityName + response.data.data.length);
                for(let i = 0; i < response.data.data.length;i++){
                    arrayIdBaned.push(response.data.data[i]._id);
                    setListPost((current)=>[...current, response.data.data[i]])
                }
                if(response.data.data.length < 5){
                    setStopLoadPostCityNameOrder(true);
                }
                else{
                    setStopLoadPostCityNameOrder(false);
                }
              }
       }
       
      //  console.log(stopLoadPostRandomPostBan);
       if(stopLoadPostRandomPostBan){
          //  console.log("Dừng luồng random")
       }
       else{
            let response = await axios.post(`${url()}/posts/GetListPostRanDomListPostBaned/HistoryOrder`,{
              ListPostBaned:arrayIdBaned,
              skip:skipStateLoadPostRandom
            })
            if(response && response.data && response.data.data && response.data.data.length && (response.data.data.length>0)){
              if(response.data.data.length < 5){
                  setStopLoadPostRandomPostBan(true);
              }
              else{
                setStopLoadPostRandomPostBan(false);
              }
              setSkipStateLoadPostRandom(skipStateLoadPostRandom + response.data.data.length);
              for(let i = 0; i < response.data.data.length;i++){
                    arrayIdBaned.push(response.data.data[i]._id);
                    setListPost((current)=>[...current, response.data.data[i]])
              };
              setListPostIdBanedScroll(arrayIdBaned);
            }
            
       }
    }
    catch(e){
       console.log(e)
    }
  }
  return (
    <BottomScrollListener onBottom={()=>handleBotton()}>
      <div 
      >
          <Navbar />
          <Header type="list" />
          <div className="option_post">
              <select onChange={(e)=>handleChangeMode(e.target.value)} className="options" name="options" id="options">
                <option value="Random">Random</option>
                <option value="My Post">My Post</option>
              </select>
              <button onClick= {()=>{setOpenFormToCreatePost(true)}} 
                      className="createPost_btn">
                      <div className="text">
                            Create Post
                      </div>
              </button>
          </div>
          {loading ? (
              <div className="loading_icon_wrapper">
                  <AutoModeIcon className="loading_icon"/>
              </div>
            ):(
              <div className="list_post_container"
              >
                {
                  [...new Map(listPost.map((item) => [item["_id"], item])).values()].map((item, index) => (
                    <div key={index}>
                        <PostEle 
                          dataPost = {item} 
                          setOpenUserTagForm = {setOpenUserTagForm}
                          setMode = {setMode}
                          setListUserChooseTag={setListUserChooseTag}
                          setIdChooseEdit = {setIdChooseEdit}
                          setOpenFormToCreatePost = {setOpenFormToCreatePost}
                          setTitle = {setTitle}
                          setListInput= {setListInput}
                          setListFileCreatePost={setListFileCreatePost}

                          setHotelRecommend= {setHotelRecommend}
                          setSiteRecommend= {setSiteRecommend}
                          setCityRecommend= {setCityRecommend}
                        />
                    </div>
                  ))
                }
                  
              </div>
          )}
          {
            openFormToCreatePost && (
              <div className="form_create_post_wrapper">
                  <div className="form_create_post">
                    <div className="list_input">
                        {
                          listInput.map((obj,index)=>
                              (
                                <textarea 
                                        onChange={(e)=>{handleChangeInputEle(obj.id,e.target.value)}}
                                        value={obj.content}
                                        key={obj.id} 
                                        className="input_text">
                                </textarea>
                              )
                            )
                        }
                    </div>
                    
                    <div>
                          {
                              (listFileCreatePost.length >0 ) && (
                              <div className="list_image_post">
                                  <>
                                      {
                                        listFileCreatePost.map((obj,index)=>
                                            (
                                              <div key={index} className="img_ele_post">
                                                    <div onClick= {()=>handleCancelUpload(obj)} className="close_icon_wrapper">
                                                        <CloseIcon className="close_icon"/>
                                                    </div>
                                                    <img src={obj} alt={index}  onError={imageOnErrorHotel}/>
                                              </div>
                                            )
                                          )
                                      }
                                  </>
                                </div>
                              )
                            }
                    </div>
                    <div className="option_create_wrapper">
                          <div className="option_create">
                              <div className="add_input">
                                    <AddIcon onClick={()=>handleAddInput()} />
                                    <div className="decription_btn">
                                        Add Paragraph
                                    </div>
                              </div>
                              <div 
                                  {...getRootProps({ className: "small_dropzone" })}
                                  className="upload_file">
                                    <input className="small_dropzone" {...getInputProps()} />
                                    <FileUploadIcon/>
                                    <div className="decription_btn">
                                        Upload
                                    </div>
                              </div>
                              <div 
                                  className="title_post"
                                  onClick={()=>setOpenFormPostTitle(true)}
                              >
                                  <TitleIcon/>
                                  <div className="decription_btn">
                                        Title
                                  </div>
                              </div>
                              <div 
                                  onClick={()=>setOpenFormHotelRecommend(true)}
                                  className="hotel_recommend_btn">
                                  <HotelIcon/>
                                  <div className="decription_btn">
                                        Hotel
                                  </div>
                              </div>
                              <div 
                                  onClick={()=>setOpenFormCityRecommend(true)}
                                  className="city_recommend_btn">
                                  <LocationCityIcon/>
                                  <div className="decription_btn">
                                        City
                                  </div>
                              </div>
                              <div onClick={()=>setOpenFormSieRecommend(true)}
                                  className="site_recommend_btn">
                                  <FmdGoodIcon/>
                                  <div className="decription_btn">
                                        Site
                                  </div>
                              </div>
                              {
                                (String(mode) !== "edit") && (
                                  <div 
                                      onClick = {()=>setOpenUserTagForm(true)}
                                      className="tag_people_btn">
                                      <LocalOfferIcon/>
                                      <div className="decription_btn">
                                            Tag
                                      </div>
                                  </div>
                                )
                              }
                              {
                                (String(mode) !== "edit") && (
                                  <div onClick={()=>setOpenRawSeen(true)}
                                  className="permission_seen_btn">
                                  <RawOnIcon/>
                                      <div className="decription_btn">
                                            Permission post
                                      </div>
                                  </div>
                                )
                              }
                              {
                                (String(mode) !== "edit") && (
                                  <div 
                                      onClick = {()=>setOpenEmotionAuthorForm(true)}
                                      className="emotion_author_btn">
                                      <MoodIcon/>
                                      <div className="decription_btn">
                                            Your emotion
                                      </div>
                                  </div>
                                )
                              }
                              
                          </div>
                          <button 
                                  onClick={()=>handlePost()}
                                  className="Post_btn">
                                    <div className="text">
                                          {
                                            (String(mode) === "edit") ? (
                                              <>Edit</>
                                            ):(
                                              <>Post</>
                                            )
                                          }
                                    </div>
                          </button>
                    </div>
                  </div>
              </div>
            )
          }
          {
            openFormPostTitle && (
              <div className="post_title_form">
                    <input 
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        className="input_title" />
                    <div 
                      onClick= {()=>{
                                  setOpenFormPostTitle(false)
                                }}
                      className="typed_title_post">
                      Type
                    </div>
              </div>
            )
          }
          {
            (openFormHotelRecommend || openFormCityRecommend || openFormSiteRecommend ) && (
              <div className="recommed_form">
                    <input 
                        value ={
                                openFormHotelRecommend ? hotelRecommend : 
                                openFormCityRecommend ? cityRecommend : 
                                openFormSiteRecommend ? siteRecommend : ""
                                }
                        onChange={(e)=>handleTypeRecommendItem(e.target.value)}
                        className="input_recommed" />
                    <div 
                      onClick= {()=>handleCloseRecommednForm()}
                      className="typed_recommend_post">
                      Type
                    </div>
                    <div className="decription_type_recommend">
                      Between two recommedations separated by a comma
                    </div>
              </div>
            )
          }
          {
            openRawSeen && (
              <div className="raw_seen_post_create">
              <select name="raw" id="raw" 
                      value = {rawSeen}
                      onChange={(e)=>{
                                      setRawSeen(e.target.value);
                                      setOpenRawSeen(false);
                                    }} >
                  <option value="Personal">Personal</option>
                  <option value="Friend">Friend</option>
                  <option value="Public">Public</option>
              </select>
              </div>
            )
          }
          {
            openEmotionAuthorForm && (
              <div className="emotion_author_form">
                <select name="emotion" id="emotion" className="emotion" 
                        value={emotionAuthor}
                        onChange={(e)=>{
                                        setEmotionAuthor(e.target.value);
                                        setOpenEmotionAuthorForm(false);
                                      }} >
                    <option value="happy">happy</option>
                    <option value="angry">angry</option>
                    <option value="sad">sad</option>
                    <option value="tired">tired</option>
                </select>
              </div>
            )
          }
          {
            openUserTagForm && (
              <div className="list_tag_form">
                  <input className="input_find_user_tag"
                          onChange= {(e)=> setFindWordUserTag(e.target.value)}
                    />
                  <div className="list_user_finded">
                      {
                          listUserTag.map((obj,index)=>
                              (
                                <div onClick= {()=>handleChooseUserTag(obj)}
                                    key={index} className="user_tag_ele" >
                                    <img className="user_tag_ele_img" src={obj.img} alt={index}  onError={imageOnErrorHotel}/>
                                    <div className="user_tag_name">{obj.username} </div>
                                </div>
                              )
                            )
                        }
                  </div>
                  {
                    (listUserChooseTag.length>0) && (
                        <div className="list_User_tag_choose">
                              {
                                listUserChooseTag.map((obj,index)=>
                                    (
                                      <div key={index}  className="img_tag_choose_wrapper">
                                          <img className="img_tag_choose" src={obj.img} alt={index}  onError={imageOnErrorHotel} />
                                          <div 
                                              onClick={()=>handleDeleteChooseUserTag(obj)}
                                              className="img_tag_choose_close">
                                              <CloseIcon className="img_tag_choose_close_icon" />
                                          </div>
                                      </div>
                                    )
                                  )
                              }
                        </div>
                    )
                  }
              </div>
            )
          }
          {
            openFormToCreatePost && (
              <div 
                  onClick= {()=>{
                                  setOpenFormToCreatePost(false);
                                  handleOutCreatePost();
                                }}
                  className="background_blur">
              </div>
            )
          }
          {
            (openFormPostTitle || openFormHotelRecommend || openFormCityRecommend 
            || openFormSiteRecommend || openRawSeen || openEmotionAuthorForm || openUserTagForm
            ) && (
              <div 
                  onClick= {()=>{
                                  
                                  if(String(mode) === "edit"){
                                    setListUserTag([]);
                                    // handleOutCreatePost();
                                    if(openUserTagForm){
                                        setMode("");
                                    }
                                  }
                                  setOpenFormPostTitle(false);
                                  handleCloseRecommednForm();
                                  setOpenRawSeen(false);
                                  setOpenEmotionAuthorForm(false);
                                  setOpenUserTagForm(false);
                                }}
                  className="background_blur2">
              </div>
            )
          }
      </div>
    </BottomScrollListener>
  );
};

export default Post;