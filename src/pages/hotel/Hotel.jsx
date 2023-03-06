import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Comment from "../../components/comment/Comment";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import MapIcon from '@mui/icons-material/Map';
import SendIcon from '@mui/icons-material/Send';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useContext, useState,useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate,Link } from "react-router-dom";
import axios from 'axios'
import {useSelector,useDispatch} from 'react-redux'
import{SearchDataSelector} from '../../redux/selector' // mỗi lần dịch là thay đổi folder cha hiện tại 
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import {url} from '../../config.js'
import {socketCient} from '../../config.js'
const Hotel = () => {
  let socket = socketCient();
  const Data = useSelector(SearchDataSelector);
  const dispatchredux = useDispatch();  // redux 
  const location = useLocation();
  const id = location.pathname.split("/")[2]; // lấy id truyền vào bằng đường link từ components search 
  const path = location.pathname.split("/")[1];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [linkMap,setLinkMap] = useState("")
  const [linkMapImg,setLinkMapImg] = useState("")
  // vote
  const [openListUserVote,setOpenListUserVote] = useState(false);
  const [openFormVote,setOpenFormVote] = useState(false);
  const [listUserVote,setListUserVote] = useState([]);
  const [mediumVote,setMediumVote] = useState(5);
  const [countVote,setCountVote] = useState(0);
  const [voteValue,setVoteValue] = useState(5);
  const [myVote,setMyVote] = useState(5);

  // nhập phản hồi 
  const [commentReply,setCommentReply] = useState("");
  const [commentReplyMode,setCommentReplyMode] = useState(""); // edit comment 
  const [commentEdit,setCommentEdit] = useState(null); // là id thôi 
  const [listComment,setListComment] = useState([]);
  const [openCommentForm,setOpenCommentForm] = useState(false);
  const [ listUserCare, setListUserCare] =useState([]);
  // mở form chat với host
  const [openOptionChatWithHost,setOpenOptionChatWithHost] = useState(false);
  // see list service 
  const [openListService,setOpenListService] = useState(false);
  const [listService,setListService] = useState([])
  
  const { data, loading } = useFetch(`${url()}/hotels/find/${id}`);
  const [dataHost,setDataHost] = useState({})
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  //const {date,options} = useSelector(SearchDataSelector);  // lấy dữ liệu tìm kiếm từ trong redux 
  //console.log("Dữ liệu từ context",{date,options});
  // const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  // function dayDifference(date1, date2) {
  //   const timeDiff = Math.abs(date2.getTime() - date1.getTime()); // trả về giá trị tuyểh đoois 
  //   const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY); // làm tròn thành ngày 
  //   return diffDays; // tính ra khoảng thời gian du lịch 
  // }

  useEffect(() => {
    const takeData= async ()=>{ 
      
          if( String(location.pathname.split("/")[1]) === "hotels"){

            axios.get(`${url()}/hotels/find/${id}`).then((res) =>{
              if(res && res.data && res.data._id){
                axios.get(`${url()}/users/${res.data.owner}`).then((res1)=>{
                  if(res1 && res1.data){
                    setDataHost(res1.data);
                  }
                }).catch((e)=>{
                  console.log(e);
                })

                setLinkMap(`https://www.google.com/maps/search/${res.data.lat},${res.data.long}/${res.data.lat},${res.data.long},10z?hl=vi`)
                axios.post(`${url()}/hotels/getImgLocationHotel`,{
                  lat: res.data.lat,
                  long: res.data.long,
                  link: `https://www.google.com/maps/search/${res.data.lat},${res.data.long}/${res.data.lat},${res.data.long},10z?hl=vi`,
                }).then((dataImg)=>{
                  if(dataImg && dataImg.data){
                     setLinkMapImg(dataImg.data.data)
                  }
                }).catch((e)=>{console.log(e)})
              }
            }).then((e)=>{
              setLinkMapImg("https://vtv1.mediacdn.vn/thumb_w/650/Uploaded/nguyetmai/2014_05_22/Riu-Palace-Las-Americas-resort-Cancun-Mexico_220514.jpg")
              console.log(e)
            })
            // dữ liệu về comment 
            let res2 = await axios.get(`${url()}/comments/TakeCommentByHotelId/${id}`)
            if(res2.data && res2.data.data){
              setListComment(res2.data.data);
            }
            
            axios.get(`${url()}/votes/CountCaculateVoteHotel/${id}`).then((res3)=>{
              if(res3.data && res3.data.data && res3.data.data.mediumVote && res3.data.data.countVote){
                setMediumVote(res3.data.data.mediumVote);
                setCountVote(res3.data.data.countVote);
              }  
            }).catch((e)=>{console.log(e)})

            axios.get(`${url()}/votes/TakeListInforUserVote/${id}`).then((res)=>{
              if(res.data && res.data.data && res.data.data.length){
                setListUserVote(res.data.data);
                setMyVote(res.data.data.find((e)=> String(e.userId) === String(user._id)).Vote || 5);
              }
            }).catch((err) => { console.log(err); });

            axios.get(`${url()}/rooms/getroombyhotelowner/${id}`).then((result)=>{
              if(result && result.data && result.data.result){
                setListService(result.data.result);
              }
            }).catch((e)=>{console.log(e)})

            axios.post(`${url()}/comments/TakeListUserCare`,{Id:id,Type:"hotels"}).then((response)=>{
              if(response && response.data && response.data.data){
                 setListUserCare(response.data.data)
              }
            }).catch((e)=>{console.log(e)})
          }
          socket.on("comment",(comment,type)=>{
            if( (String(location.pathname.split("/")[1]) === "hotels") && (String(type) === "hotels") ){
               if(comment && comment._id && (!comment.roomId) && (!comment.userIdHostPage) 
                  && comment.hotelId && ( String(comment.hotelId) === id)){
                      setListComment(current => [comment,...current]);
               }
            }
          })
          socket.on("editcomment",(comment,type)=>{
            if( (String(location.pathname.split("/")[1]) === "hotels") && (String(type) === "hotels") ){
               if(comment && comment._id && (!comment.roomId) && (!comment.userIdHostPage) 
                  && comment.hotelId && (String(comment.hotelId) === id)){
                    setListComment(current => current.map(
                      (element, i) => String(element._id) === comment._id ? comment
                                              : element
                    ));
                
               }
            }
          })
          socket.on("deletecomment",(commentId,type)=>{
            if( (String(location.pathname.split("/")[1]) === "hotels") && (String(type) === "hotels") ){
              setListComment((current) =>
                 current.filter((e) => String(e._id) !== String(commentId))
              );
            }
          })
      }
    try{
      takeData();
    }
    catch(e){
      navigate("/");
      console.log(e);
    }
  },[id,location.pathname,navigate,socket,user._id])

  const EditCommentListState = (idCommentEdit,CommentEdited) => {
    const newState = listComment.map(obj => {
      if (String(obj._id) === String(idCommentEdit)) {
        return CommentEdited;
      }
      return obj;
    });
    setListComment(newState);
  };
  // const days = dayDifference(date[0].endDate, date[0].startDate);
  // set up ảnh muốn xem 
  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };
  // xử lý di chuyển slide => rất thông minh 
  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {  //đoạn đầu là đoạn điều kiện 
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1; // nếu slideNumber bằng 0 thì chuyển thành 5 còn nếu không thì bằng slideNumber-1 
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;// tương tự bên trên 
    }
    setSlideNumber(newSlideNumber);
  };
  
  // nếu đã đăng nhập mới cho mở form book 
  // const handleClick = () => {
  //   if (user) {
  //     setOpenModal(true);
  //   } else {
  //     navigate("/login");
  //   }
  // };

  const handleOpenChat = async (userId)=>{
    try{
      setOpenOptionChatWithHost(false);
      if(String(user._id) !== String(userId)){
          dispatchredux({type: "OPENCLOSECHAT", payload: { status:true }});
          axios.post(`${url()}/conversations/getListConvByUserId`,{userId:user._id}).then((res)=>{
            if(res && res.data && res.data.data){
              dispatchredux({type: "LISTCONV", payload: { listConv:res.data.data }});
              dispatchredux({type: "COUNTCONVERSATIONUNREADER", payload: { count:res.data.data.filter((e)=> Number(e.unReader) === 1).length }});
            }
          }).catch((e)=>{
            console.log(e)
          })
          let dataConv ={};
          let response = await axios.post(`${url()}/conversations/CreateConv`,{
            senderId:user._id,
            receiverId:userId
          });
          
          if(response && response.data && response.data.data){
              if(Data.listConv.find((e)=> String(e._id) === String(response.data.data._id))){
                  dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:Data.listConv.find((e)=> String(e._id) === String(response.data.data._id)) }});
                  dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:true }});
                  axios.post(`${url()}/conversations/LoadMessage`,{
                    conversationId:response.data.data._id,
                    userId:user._id
                  }).then((res)=>{
                      if(res.data && res.data.data){
                        let arr_messages = [];
                        for(let i=res.data.data.length-1; i>=0; i--){
                          arr_messages.push(res.data.data[i])
                        };
                        dispatchredux({type: "LISTMESS", payload: { listMess:arr_messages }});
                      }
                  }).catch((e)=>{
                    console.log(e)
                  });
              }
              else{
                  dataConv.memberList = [response.data.data.memberList.find((e)=> String(e.memberId) !== String(user._id))];
                  dataConv.messageList = response.data.data.messageList;
                  dataConv.timeLastMessage= response.data.data.messageList[0].createAt;
                  dataConv.unReader =0;
                  dataConv._id = response.data.data._id;
                  dispatchredux({type: "ADDCONV", payload: { newConv:dataConv }});
                  dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:dataConv }});
                  dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:true }});
                  axios.post(`${url()}/conversations/LoadMessage`,{
                    conversationId:response.data.data._id,
                    userId:user._id
                  }).then((res)=>{
                      if(res.data && res.data.data){
                        let arr_messages = [];
                        for(let i=res.data.data.length-1; i>=0; i--){
                          arr_messages.push(res.data.data[i])
                        };
                        dispatchredux({type: "LISTMESS", payload: { listMess:arr_messages }});
                      }
                  }).catch((e)=>{
                    console.log(e)
                  });
              }
          }
      }
    }
    catch(e){
       console.log(e)
    }
  }

  const sendComment = async ()=>{
    try{
      let comment;
      if(String(path) === "hotels"){
        comment = {
          content:commentReply,
          createAt: new Date(),
          emotion:"",
          hotelId:id,
          userId:user._id
        }
      }
      if(String(commentReplyMode) === "editcomment" && commentEdit ){
          if(String(path) === "hotels"){
            let res = await axios.post(`${url()}/comments/EditCommentHotel`,{IdComment:commentEdit,content:commentReply});
            if(res && res.data && res.data.data){
              EditCommentListState(commentEdit,res.data.data);
              setCommentReply("");
              setCommentReplyMode("");
              socket.emit("editcomment",listUserCare.filter((e)=> String(e)!== String(user._id)),res.data.data,"hotels");
            }
          }
      }
      else{
          if(String(path) === "hotels"){
              axios.post(`${url()}/comments/CreateCommentHotel`,comment).then((res,err)=>{
                if(err){
                  console.log("Không thể gửi comment",err)
                }
                else if(res && res.data && res.data.data){
                  setListComment(current => [res.data.data,...current]);
                  setCommentReply("");
                  let listUserId =[];
                  listUserId.push(data.owner)
                  socket.emit("comment",listUserId,res.data.data,"hotels")
                }
              })
              // gửi thông báo đến chủ khách sạn 
              let newNotification = {
                content:`You have a new comment in hotel ${data.name}`,
                userId:data.owner,
                type:"CommentHotel",
                hotelId:data._id,
                roomId:"",
              }
              axios.post(`${url()}/notifications/CreateNotification`,newNotification)
              .then((notification)=>{
                if(notification && notification.data && notification.data.data){
                  socket.emit("notification",data.owner,notification.data.data)
                };
              })
              .catch((e)=>{console.log(e)});
          }
      }
    }
    catch(e){
      console.log(e)
    }

  }
  const handleDeleteCommentFromDad = async (id) =>{
    try{
      if(String(path)=== "hotels"){
        let res = await axios.post(`${url()}/comments/DeleteCommentHotel`,{IdComment:id});
        if(res && res.data && res.data.data){
         setListComment((current) =>
            current.filter((e) => String(e._id) !== String(res.data.data))
         );
         socket.emit("deletecomment",listUserCare.filter((e)=> String(e) !== String(user._id)),res.data.data,"hotels");
        }
      }
    }
    catch(e){
      console.log(e)
    }
  }

  const takeListUserVote  = async ()=>{
    if( String(location.pathname.split("/")[1]) === "hotels"){
      setOpenListUserVote(true);
    }
  }

  const handleVote = async ()=>{
    setOpenFormVote(false);
    if( String(location.pathname.split("/")[1]) === "hotels"){
      let voteData ={
        userId:user._id,
        hotelId:id,
        Vote:voteValue
      };
      const res = await axios.post(`${url()}/votes/MakeVoteHotel`,voteData); 
      if(res.data && res.data.data){
        const res3 = await axios.get(`${url()}/votes/CountCaculateVoteHotel/${id}`);
          if(res3.data && res3.data.data && res3.data.data.mediumVote && res3.data.data.countVote){
            setMediumVote(res3.data.data.mediumVote);
            setCountVote(res3.data.data.countVote);
        }
      }
      const res2 = await axios.get(`${url()}/votes/TakeListInforUserVote/${id}`); 
      if(res2.data && res2.data.data && res2.data.data.length){
        setListUserVote(res2.data.data);
        setMyVote(res2.data.data.find((e)=> String(e.userId) === String(user._id)).Vote || 5);
      }
    }
  }

  const OpenMap = ()=>{
    try{
      window.open(linkMap);
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
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        "loading"
      ) : (
        <div className="hotelContainer">
          {open && (   // Phần silde => học sau này áp dụng vào dự án của mình 
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}  // di chuuyển bức ảnh trái , phải => set up sliderNumber
              />
              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNumber]} // slideNumber giúp hiển thị ảnh muốn chọn 
                  alt=""
                  className="sliderImg"
                  onError ={imageOnErrorHotel}
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>
            <span className="hotelDistance">
              Excellent location – {data.distance}m from center
            </span>
            <span className="hotelPriceHighlight">
              Book a stay over ${data.cheapestPrice} at this property and get a
              free airport taxi
            </span>
            <div className="hotelImages_comment">
              {
                (data.photos && data.photos.length && data.photos.length>0) && (
                  <div className="hotelImgWrapper">
                    <img
                      onClick={() => handleOpen(0)}
                      src={data.photos[0]}
                      alt=""
                      className="hotelImg"
                      onError ={imageOnErrorHotel}
                    />
                  </div>
                )
              }
              <div className="hotelCommentWrapper">
                <div className="hotelDetailsPrice">
                  <span>
                     Your comments will help us grow up our service 
                  </span>
                  <button onClick={()=>{setOpenCommentForm(true)}} className="comment_btn">Give us some comments</button>
                </div>
                <div className="hotelDetailsPrice">
                  <span>
                     <p>Plaese vote for our hotels</p>
                     <div className="detailItem" onClick={()=>takeListUserVote()}>
                              <span className="itemKey">{countVote}</span>
                              <span className="itemValue">{(countVote<2)? "Vote":"Votes"}</span>
                              <div className="Star">
                                  <span className="itemValue">{mediumVote}</span>
                                  <span className="itemValue"><StarRateIcon className="IconStar"/></span>
                              </div>
                              <span className="itemKey">Your vote:</span>
                              <span className="itemValue">{myVote}</span>
                      </div>
                  </span>
                  <button onClick={()=>{setOpenFormVote(true)}} className="vote_btn">Vote now!</button>
                </div>
                <div className="hotelDetailsPrice">
                  <span>
                     You can see our services 
                  </span>
                  <button onClick={()=>setOpenListService(true)} className="comment_btn">See list service</button>
                </div>
              </div>
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                {/* <p className="hotelDesc">{data.desc}</p> */}
                {
                  (dataHost && dataHost._id) && (
                    
                      <div 
                         onContextMenu={(e)=>{ 
                              e.preventDefault(); 
                              setOpenOptionChatWithHost(true);
                          }}
                         className="host_infor">
                        {
                          (openOptionChatWithHost)&&(
                            <div onClick={()=>handleOpenChat(dataHost._id)} className="host_infor_option_chat">
                                Chat 
                            </div>
                          )
                        }
                        <Link className="host_infor" style={{textDecoration:"none",color:"black"}} 
                              to={`/users/${dataHost._id}`}>
                            <img src={dataHost.img}  onError ={imageOnErrorHotel} alt=""/>
                            <p>{dataHost.username}</p>
                        </Link>
                      </div>
                  )
                }
              </div>
              <div className="hotelDetailsPrice">
                {/* <h1>Perfect for a {days}-night stay!</h1> */}
                <span>
                   {data.desc}
                </span>
                <h2>
                </h2>
                <button onClick={()=>setOpenListService(true)}>Reserve or Book Now!</button>
              </div>
              <div className="linkLocation">
                <img src={linkMapImg} onError ={imageOnErrorHotel} alt=""/>
                <p style={{display:"flex"}} onClick={()=>OpenMap()} >
                   <MapIcon style={{margin:"10px"}}/>
                   Go to map
                </p>
              </div>
            </div>
            
          </div>
          {
            (openCommentForm || openListUserVote || openFormVote || openListService || openOptionChatWithHost) && (
              <div onClick={()=>{
                setOpenCommentForm(false);
                setOpenListUserVote(false);
                setOpenFormVote(false);
                setOpenListService(false);
                setOpenOptionChatWithHost(false);
              }} className="hotelContainer_blur">
              </div>
            )
          }
          {
            (openCommentForm) && (
              <div className="comment_form">

                <div className="comment_list">
                  { 
                    [...new Map(listComment.map((item) => [item["_id"], item])).values()].map(comment=>
                      (
                        <Comment 
                            key={comment._id} 
                            idComment={comment._id}
                            nameuser={comment.username} 
                            imgsource={comment.imgUser} 
                            content={comment.content} 
                            time={comment.createAt} 
                            listUserLike ={comment.emotion}
                            hostStatus ={comment.emotion.includes(user._id)}
                            hostId={user._id}
                            userIdCommented={comment.userId}
                            handleEditValueFormComment= {setCommentReply}
                            setcommentMode={setCommentReplyMode}
                            setcommentToEdit = {setCommentEdit}
                            handleDeleteComment={handleDeleteCommentFromDad}
                            typeComment={path}
                            listUserCare = {listUserCare}
                        />
                      )
                    )
                  }
                </div>
                <div className="reply_comment">
                  <textarea onChange={(e)=>setCommentReply(e.target.value)} 
                          value={commentReply} 
                          className="comment_input" 
                          placeholder={commentReplyMode}
                          rows="3" cols="70">
                  </textarea>
                  <SendIcon onClick={()=>sendComment()} className="icon_reply_comment" style={{}}/>
                </div>
              </div>
            )
          }
          {/* list user voted  */}
          {
            (openListUserVote && (listUserVote.length>0)) && (
              <div className="list_user_voted">
                {
                  listUserVote.map(user=>
                      (
                        <div key={user.userId} className="user_vote_element">
                            <img className="img_vote_element" src={user.img} alt={user.name} onError ={imageOnErrorHotel}/>
                            <div className="name_vote_element">{user.name}</div>
                            <div style={{display: "flex",margin: "20px 10px"}} className="count_vote_element">
                                <p>
                                    {user.Vote}
                                </p>
                                <StarRateIcon style={{color: "yellow",fontSize: "17px", marginLeft:"2px"}}/>
                            </div>
                        </div>
                      )
                    )
                  }
              </div>
            )
          }
          {
            (openFormVote) &&(
              <div className="form-vote">
                   <input onChange={(e)=>setVoteValue(e.target.value)} 
                          type="number" 
                          min="1" max="5" 
                          id="vote_input" 
                          name="vote_input" 
                          placeholder="Type your vote"/>
                    <br></br>
                   <div onClick={()=>handleVote()} className="btn_vote_form_vote">
                         Vote
                   </div>
              </div>
            )
          }
          {
            (openListService) &&(
              <div className="list_service_hotel">
                  {
                      listService.map(service=>
                        (
                           <div key={service._id} className="list_service_hotel_ele">
                                <Link to={`/rooms/${service._id}`} style={{textDecoration: "none"}}>
                                  <p> {service.desc} </p>
                                </Link>
                           </div>
                        )
                      )
                  }
              </div>
            )
          }
          <MailList />
          <Footer />
        </div>
      )}
      {/* truyền vào 1 số prop  */}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>}
    </div>
  );
};

export default Hotel;