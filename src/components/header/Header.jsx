import {
  faBed,
  // faCalendarDays,
  // faPerson,
  faBell
} from "@fortawesome/free-solid-svg-icons"; // icon 
import Conversation from "../conversation/Conversation";
import Message from "../message/Message";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import BookIcon from '@mui/icons-material/Book';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  // component chứa icon => cách sử dụng icon fontawesome trong 1 dự án react 
import "./header.scss";
import HomeIcon from '@mui/icons-material/Home';
//import { DateRange } from "react-date-range"; // component ngày tháng 
import {useDispatch,useSelector} from 'react-redux' // redux 
import{SearchDataSelector} from '../../redux/selector' // mỗi lần dịch là thay đổi folder cha hiện tại  
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// import { format } from "date-fns";// import component hoặc hàm 
import {  useNavigate ,Link} from "react-router-dom";
import { useEffect, useState,useContext ,useRef} from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {url} from '../../config.js'
import {socketCient} from '../../config.js'
import SendIcon from '@mui/icons-material/Send';
const Header = ({ type }) => {
  let socket = socketCient();
  const { user } = useContext(AuthContext);
  const Data = useSelector(SearchDataSelector);
  const [destination, setDestination] = useState("");
  //const [openDate, setOpenDate] = useState(false); // biến trạng thái xác định form chọn ngày tháng mở hay không 
  // const [date, setDate] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  const date = 
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    };
  
  //const [openOptions, setOpenOptions] = useState(false);
  // const [options, setOptions] = useState({
  //   adult: 1,
  //   children: 0,
  //   room: 1,
  // });
  const options = {
    adult: 1,
    children: 0,
    room: 1,
  }
  const dispatchredux = useDispatch();  // redux 
  const navigate = useNavigate();// dùng để chuyển trang 
  const scrollRef = useRef();

  // order list 
  const [openOrderList, setOpenOrderList] = useState(false);
  const [openNotificationList, setOpenNotificationList] = useState(false);
  // order detail 
  const [orderDetail, setOrderDetail] = useState([]);
  const [openOrderDetail, setOpenOrderDetail] = useState(false);

  // chat 
  //const [chatOption,setChatOption] = useState("");  // sendNormal or edit
  const [messToSend,setMessToSend] = useState("");

  // open close history search 
  const [openHistorySearch, setOpenHistorySearch] = useState(false);
  const [historySearch, setHistorySearch] = useState([]);

  // flag to scroll down 
  const [flagScrollDown, setFlagScrollDown] = useState(0);
  
  // cách viết thay đổi option rất thông minh
  // const handleOption = (name, operation) => {
  //   setOptions((prev) => {
  //     return {
  //       ...prev, // giữ nguyên những giá trị sẵn có 
  //       [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
  //     };
  //   });
  // };
  
  const handleSearch = () => {
    dispatchredux({type: "NEW_SEARCH", payload: { destination, date, options }});
    axios.post(`${url()}/users/SaveHistorySearch`,{
        userId:user._id,
        message:destination
    }).catch((e)=>{console.log(e)})
    navigate("/hotels", { state: { destination, date, options } }); 
  };
  
  const SeeOrderDetail = (order)=>{
    try{
        setOpenOrderList(false);
        setOrderDetail(order);
        setOpenOrderDetail(true);
    }
    catch(e){
        console.log(e)
    }
  }
  useEffect(() => {
    const takeData= async()=>{ 
      const res = await axios.get(`${url()}/orders/TakeOrderByUserIdOrder/${user._id}/${user.token}`); // gửi token để check 
      if(res&&(res.data)){
         dispatchredux({type: "LISTORDER", payload: { listOrder:res.data.data }});
      }

      const res2 = await axios.get(`${url()}/notifications/TakeNotificationByUserId/${user._id}`); 
      if(res2 &&(res2.data) && res2.data.data){
        
         dispatchredux({type: "LISTNOTIFICATION", payload: { listNotification:res2.data.data }});
      }
      
      axios.post(`${url()}/conversations/getListConvByUserId`,{userId:user._id}).then((res)=>{
        if(res && res.data && res.data.data){
          // console.log("Dữ liệu conv",res.data.data);
          dispatchredux({type: "LISTCONV", payload: { listConv:res.data.data }});
          dispatchredux({type: "COUNTCONVERSATIONUNREADER", payload: { count:res.data.data.filter((e)=> Number(e.unReader) === 1).length }});
        }
      }).catch((e)=>{
        console.log(e)
      })
    }
    if(user){
      takeData();
    }
    socket.on("notification",(notification,additionalInfor)=>{
      if(notification && notification._id){
        dispatchredux({type: "ADDNOTIFICATION", payload: { newNotification:notification}});
      }
      if(additionalInfor && (String(additionalInfor.Type) === "ResonseOrder") && additionalInfor.IdOrder && (String(additionalInfor.IdOrder).length === 24) && additionalInfor.TypeOrder){
        dispatchredux({type: "UPDATEORDER", payload: { IdOrder:additionalInfor.IdOrder, Status:additionalInfor.TypeOrder}});
      }
    });
    socket.on("sendMessage",(mess)=>{
      let update_cov = {};
      update_cov.unReader=1;
      // console.log("Dữ liệu nhận được",mess);
      dispatchredux({type: "ADDMESS", payload: { newMess:mess }});
      setFlagScrollDown(flagScrollDown+1);
    });
    socket.on('DeleteMessage',(convId,messId)=>{
        let arr = Data.listMess.filter((e) => String(e.messageId) !== String(messId));
        dispatchredux({type: "LISTMESS", payload: { listMess:arr }});
    })
  },[socket,user,Data.listMess,dispatchredux,flagScrollDown,]);
  

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  const CaculatePrice = (start,end,pricePerDay)=>{
    try{
       let result =(( (new Date(end) - new Date(start)) / MILLISECONDS_PER_DAY ) +1) * pricePerDay;
       return result;
    }
    catch(e){
       console.log(e);
       return 0;
    }
  }
  const handleOpenChat = (id)=>{
    try{
      dispatchredux({type: "OPENCLOSECHAT", payload: { status:true }});
      axios.post(`${url()}/conversations/getListConvByUserId`,{userId:user._id}).then((res)=>{
        if(res && res.data && res.data.data){
          dispatchredux({type: "LISTCONV", payload: { listConv:res.data.data }});
          dispatchredux({type: "COUNTCONVERSATIONUNREADER", payload: { count:res.data.data.filter((e)=> Number(e.unReader) === 1).length }});
        }
      }).catch((e)=>{
        console.log(e)
      })
    }
    catch(e){
       console.log(e)
    }
  }

  const ReadNotification = (id)=>{
    try{
      dispatchredux({type: "READNOTIFICATION", payload: { idNotify:id }});
      axios.get(`${url()}/notifications/ReadNotification/${id}`)
    }
    catch(e){
       console.log(e)
    }
  }

  const handleStartChat = (idconv)=>{
    try{ 
       dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:true }});
       let convChoose = Data.listConv.find((e)=> e._id === idconv);
       if(convChoose){
          axios.post(`${url()}/conversations/LoadMessage`,{
            conversationId:idconv,
            userId:user._id,
            isDevide:true,
            loaded:0
          }).then((res)=>{
              if(res.data && res.data.data){
                let arr_messages = [];
                for(let i=res.data.data.length-1; i>=0; i--){
                  arr_messages.push(res.data.data[i])
                };
                dispatchredux({type: "LISTMESS", payload: { listMess:arr_messages }});
                setFlagScrollDown(flagScrollDown+1);
              }
          }).catch((e)=>{
            console.log(e)
          });
          if(Number(convChoose.unReader) === 1){
            dispatchredux({type: "CHANGECONVERSATIONUNREADER", payload: { count:-1 }});
          }
          let update_cov = {};
          update_cov.timeLastMessage = convChoose.timeLastMessage;
          update_cov.unReader=0;
          update_cov.memberList=convChoose.memberList;
          update_cov.messageList=convChoose.messageList;
          dispatchredux({type: "UPDATELISTCONV", payload: { idconv:idconv, updateConv:update_cov }});
          dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:convChoose }})
       }
    }catch(e){
      console.log(e)
    }
  }
  const SendMessage = (e)=>{
    try{
      if (e.key === "Enter") {
          setMessToSend("");
          let mess = {
             conversationId:Data.conversationChosen._id,
             messageId:`${(( ((new Date()).getTime()) * 10000 ) + 621355968000000000 +8) }_${user._id}`,
             message:e.target.value,
             senderId: user._id,
             emotion:[],
             createAt:new Date(),
             receiverId: Data.conversationChosen.memberList[0].memberId
          };
          dispatchredux({type: "ADDMESS", payload: { newMess:mess }});
          axios.post(`${url()}/conversations/SendMessage`,mess).catch((e)=>{console.log(e)});
          socket.emit("sendMessage",Data.conversationChosen.memberList[0].memberId,mess);
          setFlagScrollDown(flagScrollDown+1);
      }
    }
    catch(e){
      console.log(e)
    }
  }
  const handleTakeHistorySearch = ()=>{
    try{
      setOpenHistorySearch(true);
      axios.get(`${url()}/users/TakeHistorySearch/${user._id}`).then((res)=>{
        if(res.data && res.data.data && res.data.data.history){
           setHistorySearch(res.data.data.history);
        }
      }).catch((e)=>{console.log(e)})
    }
    catch(e){
      console.log(e)
    }
  }
  
  const handleScroll = event => {
     try{
       if(Number(event.currentTarget.scrollTop) === 0){
            axios.post(`${url()}/conversations/LoadMessage`,{
                conversationId:Data.conversationChosen._id,
                userId:user._id,
                isDevide:true,
                loaded:Data.countLoadedMessage
            }).then((res)=>{
              if(res && res.data && res.data.data && (res.data.data.length > 0)){
                if(res.data && res.data.data){
                  let arr_messages = [];
                  
                  for(let i=res.data.data.length-1; i>=0; i--){
                    arr_messages.push(res.data.data[i])
                  };
                  dispatchredux({type: "LOADMESS", payload: { listMess:arr_messages }});
                  scrollRef.current.scrollIntoView({ 
                    behavior: 'smooth', block: 'center'
                  });
                }
              }
            }).catch((e)=>{console.log(e)})
       }
     }
     catch(e){
        console.log(e)
     }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });// đoạn code để trượt xuống khi có tin nhắn mới 
  }, [flagScrollDown]);
  
  return (
    <div className="header">
      <div
        // đối với trang chủ thì không truyền type vào component header
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer" // chia trường hợp class
        }
      >
        <div className="headerList">
          <div onClick={()=>setOpenOrderList(true)} className="headerListItem active">
            <FontAwesomeIcon icon={faBed} />
            <span>Orders</span>
          </div>
          <div onClick={()=>setOpenNotificationList(true)} style={{position:"relative"}} className="headerListItem active notification_btn">
            <FontAwesomeIcon className="icon" icon={faBell} />
            {
              (Data && Data.listNotification && Data.listNotification.length && (Data.listNotification.filter(e=>Number(e.Status)=== 1).length>0)) && (
                <div className="notification_count">
                      {[...new Map(Data.listNotification.map((item) => [item["_id"], item])).values()].filter(e=>Number(e.Status)=== 1).length}
                </div>
              )
            }
            <span>Notification</span>
          </div>
          <div className="headerListItem active" id="home_redirect_btn">
            <Link to="/" style={{display:"flex",textDecoration: "none", color:"white",fontSize:"20px"}}>
              <HomeIcon className="icon_home icon" />
              <span  style={{margin:"3px"}}>Home</span>
            </Link>
          </div>
          <div className="headerListItem active">
            <Link to={`/posts/${user._id}`} style={{display:"flex",textDecoration: "none", color:"white",fontSize:"20px"}}>
                <BookIcon className="icon"/>
                <span>Blog</span>
            </Link>
          </div>
          <div onClick={()=> handleOpenChat()} className="headerListItem active chat_btn" >
            <ChatBubbleIcon className="icon" />
            {
              (Data && Data.countConversationUnreader) && (
                <div className="chat_count">
                      {Data.countConversationUnreader}
                </div>
              )
            }
            <span>Chat</span>
          </div>
        </div>
        {/* nếu type khác list thì hiển thị component  */}
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              Bringing good service to you is our mission
            </h1>
            <p className="headerDesc">
              Get rewarded for your travels – unlock instant savings of 10% or
              more with a free account
            </p>
            <button className="headerBtn">
               <Link to={`/login`} style={{color:'white'}}>
                    Come Back
               </Link>
            </button>
            <button className="headerBtn">
               <a style={{color:'white'}} href="https://api-booking-app-aws-ec2.onrender.com/homepage.html">
                  Home Page
               </a>
            </button>
            <button className="headerBtn">
               <a style={{color:'white'}} href="https://admin-booking-app-render.onrender.com">
                  Admin Page
               </a>
            </button>
            <div className="headerSearch">
              <div className="headerSearchItem" id= "input_header">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)} // lấy dữ liệu địa điểm 
                  onFocus = {()=>handleTakeHistorySearch()}
                />
                {
                  openHistorySearch && (
                    <div className="form_history">
                        { 
                           (historySearch.length) && (
                              <>
                              {
                                  historySearch.map((history,index)=>
                                      (
                                        <div key={index} 
                                             onClick={()=>{
                                                            setDestination(history);
                                                          }} 
                                             className="history_ele"
                                             style={{zIndex:"10",position:"relative"}}
                                          >
                                          <p className="history_ele_text"  style={{zIndex:"10"}} >{history}</p>
                                          <hr  style={{zIndex:"10",position:"relative"}}  width="100%" align="center" />
                                        </div>
                                      )
                                    )
                                  }
                              </>
                           )
                        }
                    </div>
                  )
                }
              </div>
              {/* chọn ngày thuê */}
              {/* logic: bấm mở form chọn ngày; thay đổi giá trị trong component => thay đổi giá trị hiển thị */}
             
              <div className="headerSearchItem">
                <button className="btnSearch" onClick={handleSearch}>
                  <div className="text">
                       Search
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        <div style={ openOrderList ? {} : {display:"none"}}  className="order_list">
            <div className="order_list_title">
                List Order
            </div>
            <div className="order_list_wrapper">
                {
                  Data.listOrder.map((order,index)=>
                    (
                      <div key={index} onClick={()=>SeeOrderDetail(order)} className="order_list_ele_wrapper">
                        <div className="order_list_ele">
                            <div className="order_list_ele_icon">
                                  <FontAwesomeIcon icon={faBed} />
                            </div>
                            <div className="order_list_ele_hotel">
                                  {order.HotelName}
                            </div>
                            <div className="order_list_ele_category">
                                  {order.CategoryRoomDesc}
                            </div>
                            <div className="order_list_ele_status">
                                  {order.Status}
                            </div>
                            <div className="order_list_ele_start">
                                  {new Date(order.FirstDayServe).getDate()}/{new Date(order.FirstDayServe).getMonth()+1}/{new Date(order.FirstDayServe).getFullYear()}
                            </div>
                            <div className="order_list_ele_price">
                                  {CaculatePrice(order.FirstDayServe,order.LastDayServe,Number(order.Price))}$
                            </div>
                        </div>
                        <hr  width="100%" align="center" />
                      </div>
                    )
                  )
                }

            </div>
        </div>

        {
          openOrderDetail && (
            <div className="order_detail">
                 <div className="order_detail_title">
                      Order Detail
                  </div>
                  <div className="order_detail_infor">
                      <div className="order_detail_infor_order">
                          <div className="order_detail_infor_ele">
                              Date Order: {new Date(orderDetail.DateOrder).getDate()}/{new Date(orderDetail.DateOrder).getMonth()+1}/{new Date(orderDetail.DateOrder).getFullYear()}
                          </div>
                          <div className="order_detail_infor_ele">
                              Start: {new Date(orderDetail.FirstDayServe).getDate()}/{new Date(orderDetail.FirstDayServe).getMonth()+1}/{new Date(orderDetail.FirstDayServe).getFullYear()}
                          </div>
                          <div className="order_detail_infor_ele">
                              End: {new Date(orderDetail.LastDayServe).getDate()}/{new Date(orderDetail.LastDayServe).getMonth()+1}/{new Date(orderDetail.LastDayServe).getFullYear()}
                          </div>
                          <div className="order_detail_infor_ele">
                              Room: {orderDetail.RoomNumber}
                          </div>
                          <div className="order_detail_infor_ele">
                              Price: {CaculatePrice(orderDetail.FirstDayServe,orderDetail.LastDayServe,Number(orderDetail.Price))}$
                          </div>
                      </div>
                      <div className="order_detail_infor_service">
                          <div className="order_detail_infor_ele">
                              Category: {orderDetail.CategoryRoomDesc}
                          </div>
          
                          <div className="order_detail_infor_ele">
                              Hotel: {orderDetail.HotelName}
                          </div>
                          <Link to={`/hotels/${orderDetail.HotelId}`} style={{textDecoration: "none", color:"white",fontSize:"15px"}}>
                            <div className="order_detail_infor_btn">
                                      Go to Hotel
                            </div>
                          </Link>
                          <Link to={`/rooms/${orderDetail.CategoryRoomId}`} style={{textDecoration: "none", color:"white",fontSize:"15px"}}>
                            <div className="order_detail_infor_btn">
                                      Go to Category
                            </div>
                          </Link>
                          <div onClick={()=>{setOpenOrderDetail(false)}} className="order_detail_infor_btn">
                              Go to List Order
                          </div>
                      </div>
                  </div>
            </div>
          )
        }
        {
          openNotificationList && (
            <div className="notification_list">
                <div className="notification_list_title">
                      List Notification
                </div>
                <div className="notification_list_wrapper">
                    {   
                      [...new Map(Data.listNotification.map((item) => [item["_id"], item])).values()].map((notification,index)=>
                          (
                            <div key={index} onClick={()=>ReadNotification(notification._id)} className="notification_list_ele_wrapper">
                              {
                                 (Number(notification.Status) === 1) ?(
                                    <div>
                                    {   
                                        ((String(notification.type) === "OrderSuccess") || (String(notification.type) === "ReceiveOrder") || (String(notification.type) ==="AcceptOrder") || (String(notification.type) === "DenyOrder")) && (
                                          
                                              <div 
                                                  onClick={()=>{
                                                     setOpenNotificationList(false);
                                                     setOpenOrderList(true);
                                                  }}
                                                  style={{backgroundColor:"rgba(46, 138, 231, 0.6)"}} className="notification_list_ele">
                                                  <div className="notification_list_ele_icon">
                                                        <NotificationsActiveIcon />
                                                  </div>
                                                  <div className="notification_list_ele_content">
                                                        {notification.content}
                                                  </div>
                                              </div>
                                        ) 
                                      }
                                      {
                                        (String(notification.type) === "CommentHotel") && (
                                                 <Link to={`/hotels/${notification.hotelId}`} style={{textDecoration: "none", color:"white",fontSize:"15px"}}>
                                                      <div style={{backgroundColor:"rgba(46, 138, 231, 0.6)"}} className="notification_list_ele">
                                                          <div className="notification_list_ele_icon">
                                                                <NotificationsActiveIcon />
                                                          </div>
                                                          <div className="notification_list_ele_content">
                                                                {notification.content}
                                                          </div>
                                                      </div>
                                                  </Link>
                                        )
                                      }
                                      {
                                        (String(notification.type) === "CommentRoom") && (
                                                  <Link to={`/rooms/${notification.roomId}`} style={{textDecoration: "none", color:"white",fontSize:"15px"}}>
                                                              <div style={{backgroundColor:"rgba(46, 138, 231, 0.6)"}} className="notification_list_ele">
                                                                  <div className="notification_list_ele_icon">
                                                                        <NotificationsActiveIcon />
                                                                  </div>
                                                                  <div className="notification_list_ele_content">
                                                                        {notification.content}
                                                                  </div>
                                                              </div>
                                                  </Link>
                                        )
                                      }
                                    </div>
                                 ):(
                                  <>
                                        { 
                                          ((String(notification.type) === "OrderSuccess") || ( String(notification.type) === "ReceiveOrder") || (String(notification.type) === "AcceptOrder") || (String(notification.type) === "DenyOrder")) && (
                                            
                                                <div  
                                                     onClick={()=>{
                                                      setOpenNotificationList(false);
                                                      setOpenOrderList(true);
                                                    }}
                                                    className="notification_list_ele">
                                                    <div className="notification_list_ele_icon">
                                                          <NotificationsActiveIcon />
                                                    </div>
                                                    <div className="notification_list_ele_content">
                                                          {notification.content}
                                                    </div>
                                                </div>

                                          ) 
                                        }
                                        {
                                          (String(notification.type) === "CommentHotel") && (
                                                  <Link to={`/hotels/${notification.hotelId}`} style={{textDecoration: "none", color:"white",fontSize:"15px"}}>
                                                        <div  className="notification_list_ele">
                                                            <div className="notification_list_ele_icon">
                                                                  <NotificationsActiveIcon />
                                                            </div>
                                                            <div className="notification_list_ele_content">
                                                                  {notification.content}
                                                            </div>
                                                        </div>
                                                    </Link>
                                          )
                                        }
                                        {
                                        (String(notification.type) === "CommentRoom") && (
                                                  <Link to={`/rooms/${notification.roomId}`} style={{textDecoration: "none", color:"white",fontSize:"15px"}}>
                                                              <div  className="notification_list_ele">
                                                                  <div className="notification_list_ele_icon">
                                                                        <NotificationsActiveIcon />
                                                                  </div>
                                                                  <div className="notification_list_ele_content">
                                                                        {notification.content}
                                                                  </div>
                                                              </div>
                                                  </Link>
                                        )
                                      }
                                    </>
                                 )
                              }
                              <hr  width="100%" align="center" />
                            </div>
                          )
                        )
                      }
                </div>
            </div>
          )
        }
        {
          Data.isOpenChat && (
            <div className="box_chat">
                {
                  (Data.chatMode) && (
                    <div 
                       onClick={()=>{
                          dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:false }});
                          // setChatOption("");
                          axios.post(`${url()}/conversations/getListConvByUserId`,{userId:user._id}).then((res)=>{
                            if(res && res.data && res.data.data){
                              // console.log("Dữ liệu conv",res.data.data);
                              dispatchredux({type: "LISTCONV", payload: { listConv:res.data.data }});
                              dispatchredux({type: "COUNTCONVERSATIONUNREADER", payload: { count:res.data.data.filter((e)=> Number(e.unReader) === 1).length }});
                            }
                          }).catch((e)=>{
                            console.log(e)
                          })
                       }}
                       className="back_to_list_conv">
                       <AssignmentReturnIcon />
                    </div>
                  )
                }
                {
                  (!Data.chatMode) && (
                    <div className="list_conversation">
                        {
                          [...new Map(Data.listConv.sort((a,b)=>{
                              if (new Date(a.timeLastMessage) > new Date(b.timeLastMessage)) {
                                return -1;
                              }
                              if (new Date(a.timeLastMessage) < new Date(b.timeLastMessage)) {
                                return 1;
                              }
                              return 0;
                            }).map((item) => [item["_id"], item])).values()].map((item,index)=>(
                            <div key={index} onClick={()=>handleStartChat(item._id)} >
                                <Conversation  dataConv={item}/>
                            </div>
                          ))
                        }
                    </div>
                  )
                }
                {
                  (Data.chatMode) && (
                    <div className="message-box">
                          <div className="message_list_wrapper" onScroll={(e)=>handleScroll(e)}>
                                    { 
                                      [...new Map(Data.listMess.map((item) => [item["messageId"], item])).values()]
                                        .sort((a,b)=>{
                                          if (new Date(a.createAt) < new Date(b.createAt)) {
                                            return -1;
                                          }
                                          else{
                                            return 1;
                                          }
                                        })
                                        .map((item,index)=>(
                                        <div ref={scrollRef} key={index}>
                                              <Message 
                                                  dataMess={item} 
                                                  dataConv={Data.conversationChosen} 
                                              />
                                        </div>
                                      ))
                                    }
                          </div>
                          <div className="message-box-input-wrapper">
                              <input 
                                    onChange={(e)=>{setMessToSend(e.target.value)}}
                                    value = {messToSend}
                                    onKeyDown ={(e) => SendMessage(e)} 
                                    className="message-box-input" type="text" />
                          </div>
                    </div>
                  )
                }
              
            </div>
          )
        }
  
        {
        (openOrderList || openOrderDetail || openNotificationList || Data.isOpenChat) && (
          <div 
             onClick={()=> { 
                             dispatchredux({type: "LISTMESS", payload: { listMess:[] }});
                             dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:{} }})
                             dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:false }});
                             setOpenOrderList(false);
                             setOpenOrderDetail(false);
                             setOpenNotificationList(false);
                             dispatchredux({type: "OPENCLOSECHAT", payload: { status:false }});
                           }} 
             className="background_blur">
          </div>
        )
       }
       {
        (openHistorySearch) && (
          <div 
             onClick={()=> { 
                             setOpenHistorySearch(false)
                           }} 
             className="background_blur_search">
          </div>
        )
       }
      </div>
    </div>
  );
};

export default Header;
