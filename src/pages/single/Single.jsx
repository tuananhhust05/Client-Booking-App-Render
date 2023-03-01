import "./single.scss";
import Header from "../../components/header/Header";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CancelIcon from '@mui/icons-material/Cancel';
import Comment from "../../components/comment/Comment";
import Canlerdal from "../../components/canlerdal/Canlerdal";
import StarRateIcon from '@mui/icons-material/StarRate';
import SendIcon from '@mui/icons-material/Send';
import {BedroomParent} from '@mui/icons-material'
import { useLocation, useNavigate ,Link} from "react-router-dom";
import { useEffect, useState,useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {url} from '../../config.js'
import {socketCient} from '../../config.js'

const Single = () => {
  let socket = socketCient();
  const { user } = useContext(AuthContext);
  // chỉ hiển thị thông tin về khách sạn và loại phòng 
  const navigate = useNavigate();
  const location = useLocation(); 
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];  // id khách sạn 

  const [data,setData] = useState({}); // chung => sau đặt lại tên biến
  const [listComment,setListComment] = useState([]);
  const [mediumVote,setMediumVote] = useState(5);
  const [countVote,setCountVote] = useState(0)

  // vote 
  const [listUserVote,setListUserVote] = useState([]);
  const [openListUserVote,setOpenListUserVote] = useState(false);
  const [openListImage,setOpenListImage] = useState(false)
  
  // edit hotel Infomation 
  const [openEditForm,setOpenEditForm] = useState(false);
  
  // data để edit thông tin khách sạn 
  const [dataHotelToEdit,setDataHotelToEdit] = useState({});
  const [dataRoomToEdit,setDataRoomToEdit] = useState({});
  const [dataUserToEdit,setDataUserToEdit] = useState({})
  // nhập phản hồi 
  const [commentReply,setCommentReply] = useState("");

  // edit comment 
  const [commentReplyMode,setCommentReplyMode] = useState("");
  const [commentEdit,setCommentEdit] = useState(null); // là id thôi 
  
  // list room 
  const [openListRoom,setOpenListRoom] = useState(false);
  const [roomNumberToBook,setRoomNumberToBook] = useState(false);
  const [roomIdNumberToBook,setRoomIdNumberToBook] = useState(false);
  const [arrayDayUnAvailabilityRoomNumberBook,setArrayDayUnAvailabilityRoomNumberBook] = useState([])
  const [dataHotelOfRoom,setDataHotelOfRoom] = useState({}); // for book room 
  
  const [ listUserCare, setListUserCare] =useState([]);
  const [openFormChat,setOpenFormChat]= useState(false);
  // replace element in react array state 
  const EditCommentListState = (idCommentEdit,CommentEdited) => {
    const newState = listComment.map(obj => {
      if (String(obj._id) === String(idCommentEdit)) {
        return CommentEdited;
      }
      return obj;
    });
    setListComment(newState);
  };

  const sendComment = async ()=>{
    try{
      let comment;
      if(String(path) === "rooms" && data.hotelOwner){
        comment = {
          content:commentReply,
          createAt: new Date(),
          emotion:"",
          hotelId:data.hotelOwner,
          roomId:id,
          userId:user._id
        }
      }
      
      if(String(commentReplyMode) === "editcomment" && commentEdit ){
          if(String(path) === "rooms"){
            let res = await axios.post(`${url()}/comments/EditCommentRoom`,{IdComment:commentEdit,content:commentReply});
            if(res && res.data && res.data.data){
              EditCommentListState(commentEdit,res.data.data);
              setCommentReply("");
              setCommentReplyMode("");
            }
            socket.emit("editcomment",listUserCare.filter((e)=> e!= user._id),res.data.data,"rooms");
          }
         
      }
      else{
         if(String(path) === "rooms"){
                axios.post(`${url()}/comments/CommentRoom`,comment).then((res,err)=>{
                  if(err){
                    console.log("Không thể gửi comment",err)
                  }
                  else if(res && res.data && res.data.data){
                    setListComment(current => [res.data.data,...current]);
                    setCommentReply("");
                    let listUserId =[];
                    listUserId.push(data.Owner)
                    socket.emit("comment",listUserId,res.data.data,"rooms")
                  }
                });
                // gửi thông báo đến chủ khách sạn 
                let newNotification = {
                  content:`You have a new comment in room ${data.desc} hotel ${data.hotelNameOwn}`,
                  userId:data.Owner,
                  type:"CommentRoom",
                  hotelId:data.hotelOwner,
                  roomId:data._id,
                }
                axios.post(`${url()}/notifications/CreateNotification`,newNotification)
                .then((notification)=>{
                  if(notification && notification.data && notification.data.data){
                    socket.emit("notification",data.Owner,notification.data.data)
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
        }
      }
      else if(String(path)=== "rooms"){
        let res = await axios.post(`${url()}/comments/DeleteCommentRoom`,{IdComment:id});
        if(res && res.data && res.data.data){
         setListComment((current) =>
            current.filter((e) => String(e._id) !== String(res.data.data))
         );
         socket.emit("deletecomment",listUserCare.filter((e)=> e!= user._id),res.data.data,"rooms");
        }
      }
      else if(String(path)=== "users"){
        let res = await axios.post(`${url()}/comments/DeleteCommentPersonalPage`,{IdComment:id});
        if(res && res.data && res.data.data){
         setListComment((current) =>
            current.filter((e) => String(e._id) !== String(res.data.data))
         );
        }
      }
    }
    catch(e){
      console.log(e)
    }
  }
  useEffect(() => {
    const takeData= async ()=>{ 
        if(String(location.pathname.split("/")[1]) === "rooms"){
            let res = await axios.get(`${url()}/rooms/${id}`);
            if(res && res.data){
              setData(res.data);
              setDataRoomToEdit(res.data)
              // dữ liệu về comment 
              const res2 = await axios.post(`${url()}/comments/TakeCommentByRoomIdHotelId`,{
                 roomId: id,
                 hotelId:res.data.hotelOwner
              }); 
              if(res2.data && res2.data.data){
                setListComment(res2.data.data);
              }

              // dữ liệu về khách sạn chứa phòng 
              const resHotel = await axios.get(`${url()}/hotels/find/${res.data.hotelOwner}`);
              if(resHotel && resHotel.data && resHotel.data._id){
                setDataHotelOfRoom(resHotel.data);
              }
            };
            axios.get(`${url()}/votes//CountCaculateVoteRoom/${id}`).then((res3)=>{
              if(res3.data && res3.data.data && res3.data.data.mediumVote && res3.data.data.countVote){
                setMediumVote(res3.data.data.mediumVote);
                setCountVote(res3.data.data.countVote);
              }
            }).catch((e)=>{
              console.log(e);
            })
          
            axios.post(`${url()}/comments/TakeListUserCare`,{Id:id,Type:"rooms"}).then((response)=>{
              if(response && response.data && response.data.data){
                 setListUserCare(response.data.data)
              }
            }).catch((e)=>{console.log(e)})
        }
        socket.on("comment",(comment,type)=>{
          if((String(location.pathname.split("/")[1]) === "rooms") && (type == "rooms") ){
              if(comment && comment._id && (comment.roomId) && (!comment.userIdHostPage) 
                  && comment.hotelId && (comment.roomId == id)){
                  setListComment(current => [comment,...current]);
              }
          }
        })
        socket.on("editcomment",(comment,type)=>{
          if( (String(location.pathname.split("/")[1]) === "rooms") && (type == "rooms") ){
            console.log("edit 1")
            if(comment && comment._id && (comment.roomId) && (!comment.userIdHostPage) 
               && comment.hotelId && (comment.roomId == id)){
                console.log("edit 2")
                 setListComment(current => current.map(
                   (element, i) => element._id == comment._id ? comment
                                           : element
                 ));
            }
          }
        })
        socket.on("deletecomment",(commentId,type)=>{
          if( (String(location.pathname.split("/")[1]) === "rooms") && (type == "rooms") ){
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
  },[])

  const takeListUserVote  = async ()=>{
     if(String(location.pathname.split("/")[1]) === "rooms"){
      const res = await axios.get(`${url()}/votes/TakeListInforUserVoteRoom/${id}`); 
      if(res.data && res.data.data){
        console.log(res.data.data);
        setListUserVote(res.data.data);
        setOpenListUserVote(true)
      }
    }
  }

  const handleChangeValueEdit = (value,field)=>{
    if(String(location.pathname.split("/")[1]) === "rooms"){
      setDataRoomToEdit((prev) => {
        return {
          ...prev, 
          [field]: value,
        };
      });
    }
   
  }

  const handleSendEdit = async ()=>{
     try{
      setOpenEditForm(false);
      if (String(location.pathname.split("/")[1]) === "rooms"){
        let res = await axios.put(`${url()}/rooms/${id}`,dataRoomToEdit);
        if(res && res.data){
          setData(res.data);
          setDataRoomToEdit(res.data)
        }
      }
     }
     catch(e){
      console.log(e)
     }
  }

  const handleChooseRoomToBook = async (roomNum,IdroomNum)=>{
    try{
      // số phòng 
      let res = await axios.get(`${url()}/rooms/GetArrayDayUnAvailabilityRoomNumber/${IdroomNum}`);
            if(res && res.data){
              if(res.data.data){
                setArrayDayUnAvailabilityRoomNumberBook(res.data.data);
              }
            };
      setRoomNumberToBook(roomNum);
      setRoomIdNumberToBook(IdroomNum);
    }
    catch(e){
       console.log(e)
    }
  }

  const sendCommentEnter = (e)=>{
    try{
      if (e.key === "Enter") {
        sendComment();
      }
    }
    catch(e){
      console.log(e)
    }
  }

  const BrokenImageHotel ="https://danviet.mediacdn.vn/296231569849192448/2022/12/24/11-167186872826516072932.jpg";
  const imageOnErrorHotel = (event) => {
    event.currentTarget.src = BrokenImageHotel;
  };
  return (
    <div className="single">
      <Header type="list" />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div onClick={()=>setOpenEditForm(true)} className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            {
              (path === "rooms") &&(
                  (data !== {}) && (
                      <div className="item">
                          <img
                            src={data.photos && data.photos.length > 0 ? data.photos[0] : ""}
                            alt=""
                            className="itemImg"
                            onError= {imageOnErrorHotel}
                          />
                          <div className="details">
                            <h1 className="itemTitle">{data.desc}</h1>
                            <div className="detailItem">
                              <span className="itemKey">Hotel:</span>
                              <span className="itemValue">
                                  <Link to={`/hotels/${data.hotelOwner}`} style={{textDecoration: "none"}}>
                                         {data.hotelNameOwn}
                                  </Link>
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Max People:</span>
                              <span className="itemValue">{data.maxPeople}</span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Title:</span>
                              <span className="itemValue">
                                  {data.title}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Price:</span>
                              <span className="itemValue">
                                  {data.price}
                              </span>
                            </div>

                            <div className="detailItem">
                              <span className="itemKey">Comments</span>
                              <span className="itemValue">{listComment.length}</span>
                            </div>
                            <div className="detailItem" onClick={()=>takeListUserVote()}>
                              <span className="itemKey">{countVote}</span>
                              <span className="itemValue">{(countVote<2)? "Vote":"Votes"}</span>
                              <div className="Star">
                                  <span className="itemValue">{mediumVote}</span>
                                  <span className="itemValue"><StarRateIcon className="IconStar"/></span>
                              </div>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey" style={{cursor:"pointer"}} onClick={()=>{setOpenListRoom(true)}} >See List Room</span>
                            </div>
                          </div>
                      </div>
                  )
              )
            }
            {
              (path === "users") &&(
                  (data !== {}) && (
                      <div className="item">
                          <img
                            src={data.img ? data.img : ""}
                            alt=""
                            className="itemImg"
                          />
                          <div className="details">
                            <h1 className="itemTitle">{data.username}</h1>
                            <div className="detailItem">
                              <span className="itemKey"> Country:</span>
                              <span className="itemValue">
                                         {data.country}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">City:</span>
                              <span className="itemValue">{data.city}</span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Email:</span>
                              <span className="itemValue">
                                  {data.email}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Date Join:</span>
                              <span className="itemValue">
                                  {`${new Date(data.createdAt).getDate()}/${new Date(data.createdAt).getMonth()+1}/${new Date(data.createdAt).getFullYear()}`}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Phone:</span>
                              <span className="itemValue">
                                  {data.phone}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Admin:</span>
                              <span className="itemValue">
                                  {data.isAdmin ? "Yes" :"No"}
                              </span>
                            </div>

                            {/* <div className="detailItem">
                              <span className="itemKey">Comments</span>
                              <span className="itemValue">{listComment.length}</span>
                            </div>
                            <div className="detailItem" onClick={()=>takeListUserVote()}>
                              <span className="itemKey">{countVote}</span>
                              <span className="itemValue">{(countVote<2)? "Vote":"Votes"}</span>
                              <div className="Star">
                                  <span className="itemValue">{mediumVote}</span>
                                  <span className="itemValue"><StarRateIcon className="IconStar"/></span>
                              </div>
                            </div> */}
                          </div>
                      </div>
                  )
              )
            }
          </div>
          {
            ( (path === "hotels") && (data !== {}) && (data.photos) && (data.photos.length>0) )
            && (
              <div className="right">
                  <div className="img1">
                     <img
                       src={data.photos && data.photos.length>0 ? data.photos[0] : ""}
                       alt=""
                       className="itemImg1"
                       onError= {imageOnErrorHotel}
                     />
                  </div>
                  <div onClick = {()=>setOpenListImage(true)} className="img2">
                      <img
                          src={data.photos && data.photos.length>1 ? data.photos[1] : ""}
                          alt=""
                          className="itemImg2"
                          onError= {imageOnErrorHotel}
                        />
                      {
                        (data.photos.length>1) &&(
                          <div className="count">
                              <p>
                                 {data.photos.length -1}+
                              </p>
                         </div>
                        )
                      }
                  </div>
                   {/*upload file*/}
                  {/* <div {...getRootProps({ className: "dropzone" })}>
                    <input className="input-zone" {...getInputProps()} />
                    <button className="snip15823">Upload</button>
                  </div> */}
              </div>
            )
          }
          {
            ( (path === "rooms") && (data !== {}) && (data.photos) && (data.photos.length>0) )
            && (
              <div className="right">
                  <div className="img1">
                     <img
                       src={data.photos && data.photos.length>0 ? data.photos[0] : ""}
                       alt=""
                       className="itemImg1"
                       onError= {imageOnErrorHotel}
                     />
                  </div>
                  <div onClick = {()=>setOpenListImage(true)} className="img2">
                      <img
                          src={data.photos && data.photos.length>1 ? data.photos[1] : ""}
                          alt=""
                          className="itemImg2"
                          onError= {imageOnErrorHotel}
                        />
                      {
                        (data.photos.length>1) &&(
                          <div className="count">
                              <p>
                                 {data.photos.length -1}+
                              </p>
                         </div>
                        )
                      }
                  </div>
                   {/*see List room*/}
                  <div className="dropzone">
                    <button className="snip15823" 
                            onClick={()=>{setOpenListRoom(true)}}
                    >
                          List Room
                    </button>
                  </div>
              </div>
            )
          }
        </div>
        <div className="comment">
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
      </div>
      
      {/*Tạo bình luận*/}
      {
        openFormChat && (
          <div className="reply_comment">
            <textarea onChange={(e)=>setCommentReply(e.target.value)} 
                    value={commentReply} 
                    className="comment_input" 
                    placeholder={commentReplyMode}
                    onKeyPress = {(e)=> sendCommentEnter(e)}
                    rows="9" cols="50">
            </textarea>
            {/* <SendIcon onClick={()=>sendComment()} className="icon_reply_comment" style={{}}/> */}
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
                         <img className="img_vote_element" src={user.img} alt={user.name}/>
                         <div className="name_vote_element">{user.name}</div>
                         <div className="count_vote_element">
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
        openListImage && (
          <div className="listImage">
              <div className="listImage_temp">
                  { 
                    data.photos && (data.photos.length >0)  && (
                      data.photos.map(imgSource=>
                        ( <div key={imgSource} className="img_listImage_wrapper">
                            {/* <CloseIcon onClick={()=>handeDeleteImgHotel(id,imgSource)} className="close_icon"/> */}
                             <img  src={imgSource} className="img_listImage"/>
                          </div>
                        )
                      )
                    )
                  }
              </div>
          </div>
        )
      }

      {/* list rooms  */}
      {
        (openListRoom ) && (
          <div className="list_room_ele">
              {
                roomNumberToBook && (
                  <h3>{roomNumberToBook}</h3>
                )
              }
              {
                (!roomNumberToBook)  && (
                    <div className="list_room_ele_wrapper">
                          {
                                data.roomNumbers.map(roomNum=>
                                  (
                                    <div key={roomNum._id} onClick={()=>handleChooseRoomToBook(roomNum.number,roomNum._id)} className="list_room_ele_num">
                                          <BedroomParent className="list_room_ele_num_icon" />
                                          <p>{roomNum.number}</p>
                                    </div>
                                  )
                                )
                          }
                    </div>
                )
              }
              {
                roomNumberToBook && (
                  <div className="canlerdal_room_to_book">
                       <Canlerdal 
                           month={new Date().getMonth()+1} 
                           year ={new Date().getFullYear()}
                           handleChangeDayUnAvailability = {setArrayDayUnAvailabilityRoomNumberBook}
                           arrayDayUnAvailability={arrayDayUnAvailabilityRoomNumberBook}
                           IdRoomNumber={roomIdNumberToBook}
                           RoomNumber={roomNumberToBook}
                           CategoryRoomId={id}
                           CategoryRoomDesc={data.desc}
                           UserOrderId={user._id}
                           PhoneUserOrder={user.phone}
                           NameUserOrder={user.username}
                           EmailUserOrder={user.email}
                           ImgUserOrder={user.img}
                           PhoneContactExtra="1"
                           PricePerDay={data.price}
                           HotelId={dataHotelOfRoom._id}
                           HotelName={dataHotelOfRoom.name}
                           OwnerId= {dataHotelOfRoom.owner}
                        />
                  </div>
                )
              }
              {
                roomNumberToBook && (
                  <h4 onClick={()=>setRoomNumberToBook(false)}>Other room</h4>
                )
              }
             
          </div>
        )
      }

      {/*background blur*/}
      {
        (openListUserVote || openListImage ||openEditForm || openListRoom ) && (
          <div 
             onClick={()=> {
                             setOpenListUserVote(false);
                             setOpenListImage(false);
                             setOpenEditForm(false);
                             setOpenListRoom(false)
                           }} 
             className="background_blur">
          </div>
        )
      }
      {
        openEditForm && (
          <div className="editForm">
            {
              (path === "hotels") && (
                <>
                  <input
                    type="text"
                    placeholder="city"
                    id="city"
                    value ={dataHotelToEdit.city}
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    className="lInput"
                  />
                  <input
                    type="text"
                    placeholder="address"
                    id="address"
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    value ={dataHotelToEdit.address}
                    className="lInput"
                  />
                  <input
                    type="text"
                    placeholder="title"
                    id="title"
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    value={dataHotelToEdit.title}
                    className="lInput"
                  /> 
                  <input
                    type="text"
                    placeholder="type"
                    id="type"
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    value ={dataHotelToEdit.type}
                    className="lInput"
                  />
                  <button onClick={()=>handleSendEdit()} className="snip1582">Submit</button>
                </>
              )
            }
            {
              (path === "rooms") && (
                <>
                  <input
                    type="number"
                    placeholder="maxPeople"
                    id="maxPeople"
                    value ={dataHotelToEdit.city}
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    className="lInput"
                  />
                  <input
                    type="text"
                    placeholder="price"
                    id="price"
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    value ={dataHotelToEdit.address}
                    className="lInput"
                  />
                  <input
                    type="text"
                    placeholder="title"
                    id="title"
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    value={dataHotelToEdit.title}
                    className="lInput"
                  /> 
                  <button onClick={()=>handleSendEdit()} className="snip1582">Submit</button>
                </>
              )
            }
            {
              (path === "users") && (
                <>
                  <input
                    type="text"
                    placeholder="email"
                    id="email"
                    value ={dataUserToEdit.email}
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    className="lInput"
                  />
                  <input
                    type="text"
                    placeholder="city"
                    id="city"
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    value ={dataUserToEdit.city}
                    className="lInput"
                  />
                  <input
                    type="text"
                    placeholder="country"
                    id="country"
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    value={dataUserToEdit.country}
                    className="lInput"
                  /> 
                  <input
                    type="text"
                    placeholder="phone"
                    id="phone"
                    onChange= {(e)=>handleChangeValueEdit(e.target.value,e.target.id)}
                    value={dataUserToEdit.phone}
                    className="lInput"
                  /> 
                  <button onClick={()=>handleSendEdit()} className="snip1582">Submit</button>
                </>
              )
            }
          </div>
        )
      }
      {
        (!openFormChat) && (
          <div 
               onClick={()=>{
                setOpenFormChat(true)
                }}
               className="icon_open_message">
              <ChatBubbleIcon className="icon"/>
          </div>
        )
      }
      { (openFormChat) && (
        <div onClick={()=>{
                setOpenFormChat(false)
                }}
               className="icon_open_message">
                 <CancelIcon className="icon"/>
        </div>
      )
      }
    </div>
  );
};

export default Single;
