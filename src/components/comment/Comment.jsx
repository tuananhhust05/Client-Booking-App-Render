import "./comment.scss";
import axios from "axios";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useState,useEffect} from 'react'
import { useLocation} from "react-router-dom";
import { Link} from "react-router-dom";
import {url} from '../../config.js'
import{SearchDataSelector} from '../../redux/selector'
import {useSelector,useDispatch} from 'react-redux'
import {socketCient} from '../../config.js'
const Comment = ({idComment,nameuser,imgsource,content,time,listUserLike,hostStatus,
                  hostId,handleEditValueFormComment,setcommentMode,setcommentToEdit,
                  userIdCommented,handleDeleteComment,typeComment,listUserCare}) => {
  let socket = socketCient();
  const Data = useSelector(SearchDataSelector);
  const dispatchredux = useDispatch();
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [openListUserLike,setOpenListUserLike] = useState(false);
  const [openCommentOption,setOpenCommentOption] = useState(false);
  const [likeStatus,setLikeStatus] = useState(hostStatus);
  const [listUserLikeId,setListUserLikeId]= useState(listUserLike.filter( e => Number(String(e).length) === 24)); // để call api lấy danh sách chi tiết 
  const [listUserLikeDetail,setListUserLikeDetail]= useState([]); // danh sách chi tiết 
  const [linkImgUserComment,setLinkImgUserComment] = useState(imgsource);
  const showListUserReaction =()=>{
    axios.post(`${url()}/users/TakeUserInfoByListId`,{users:listUserLikeId}).then((res,err)=>{
        if(err){
            console.log("Không thể lấy được dữ liệu của người like bình luận",err)
        }
        else if(res){
            setOpenListUserLike(true);
            setListUserLikeDetail(res.data.data)
        }
    });
  }
  useEffect(() => {
    socket.on("editcomment",(comment,type)=>{
        if( (String(location.pathname.split("/")[1]) === "hotels") && (type == "hotels") ){
           if(comment && comment._id && (comment._id == idComment) && comment.emotion   && (!comment.roomId) && (!comment.userIdHostPage) 
              && comment.hotelId && (comment.hotelId == id)){
                if(comment.emotion.length){
                    setListUserLikeId(comment.emotion.filter( e => Number(String(e).length) === 24));
                    if((!imgsource) && (imgsource.trim()== "")){
                        axios.get(`${url()}/users/${userIdCommented}`).then((res)=>{
                            if(res && res.data){
                                setLinkImgUserComment(res.data.img)
                            }
                        })
                    }
                }
                else{
                    setListUserLikeId([])
                }
           }
        }
        else if( (String(location.pathname.split("/")[1]) === "rooms") && (type == "rooms") ){
            if(comment && comment._id && (comment._id == idComment) && comment.emotion   && (comment.roomId) && (!comment.userIdHostPage) 
               && comment.hotelId && (comment.roomId == id)){
                 if(comment.emotion.length){
                     setListUserLikeId(comment.emotion.filter( e => Number(String(e).length) === 24));
                     if((!imgsource) && (imgsource.trim()== "")){
                         axios.get(`${url()}/users/${userIdCommented}`).then((res)=>{
                             if(res && res.data){
                                 setLinkImgUserComment(res.data.img)
                             }
                         })
                     }
                 }
                 else{
                     setListUserLikeId([])
                 }
            }
        }
      })
    },[])
  const LikeDislike = (status) =>{
    if(String(typeComment) === "hotels"){
        axios.post(`${url()}/comments/LikeDislikeCommentHotel`,{userId:hostId,commentId:idComment,status}).then((res,err)=>{
            if(err){
                console.log("Không thể bày tỏ cảm xúc với bình luận",err)
            }
            else if(res){
                if(res.data.data.result){
                    if(status){
                        setLikeStatus(true);
                        setListUserLikeId(current => [...current, String(hostId)]);
                        if(res.data.data.updatedLikeCommentHotel){
                            socket.emit("editcomment",listUserCare.filter((e)=> e!= hostId),res.data.data.updatedLikeCommentHotel,"hotels");
                        }
                    }
                    else{
                        setLikeStatus(false);
                        setListUserLikeId(listUserLikeId.filter(e=> String(e) !== String(hostId)));
                        if(res.data.data.updatedDisLikeCommentHotel){
                            socket.emit("editcomment",listUserCare.filter((e)=> e!= hostId),res.data.data.updatedDisLikeCommentHotel,"hotels");
                        }
                    }
                }
                socket.emit("editcomment",listUserCare.filter((e)=> e!= hostId),res.data.data.updatedLikeCommentHotel,"hotels");
            }
        });
    }
    else if (String(typeComment) === "rooms"){
        axios.post(`${url()}/comments/LikeDislikeCommentRoom`,{userId:hostId,commentId:idComment,status}).then((res,err)=>{
            if(err){
                console.log("Không thể bày tỏ cảm xúc với bình luận",err)
            }
            else if(res){
                if(res.data.data.result){
                    if(status){
                        setLikeStatus(true);
                        setListUserLikeId(current => [...current, String(hostId)]);
                        if(res.data.data.updatedLikeCommentHotel){
                            socket.emit("editcomment",listUserCare.filter((e)=> e!= hostId),res.data.data.updatedLikeCommentHotel,"rooms");
                        }
                    }
                    else{
                        setLikeStatus(false);
                        setListUserLikeId(listUserLikeId.filter(e=> String(e) !== String(hostId)));
                        if(res.data.data.updatedDisLikeCommentHotel){
                            socket.emit("editcomment",listUserCare.filter((e)=> e!= hostId),res.data.data.updatedDisLikeCommentHotel,"rooms");
                        }
                    }
                }
            }
        });
    }
    else if (String(typeComment) === "users"){
        axios.post(`${url()}/comments/LikeDislikeCommentPersonalPage`,{userId:hostId,commentId:idComment,status}).then((res,err)=>{
            if(err){
                console.log("Không thể bày tỏ cảm xúc với bình luận",err)
            }
            else if(res){
                if(res.data.data.result){
                    if(status){
                        setLikeStatus(true);
                        setListUserLikeId(current => [...current, String(hostId)]);
                    }
                    else{
                        setLikeStatus(false);
                        setListUserLikeId(listUserLikeId.filter(e=> String(e) !== String(hostId)))
                    }
                }
               
            }
        });
    }
    else if (String(typeComment) === "post"){
        axios.post(`${url()}/comments/LikeDislikePost`,{userId:hostId,commentId:idComment,status}).then((res,err)=>{
            if(err){
                console.log("Không thể bày tỏ cảm xúc với bình luận",err)
            }
            else if(res){
                if(res.data.data.result){
                    if(status){
                        setLikeStatus(true);
                        setListUserLikeId(current => [...current, String(hostId)]);
                    }
                    else{
                        setLikeStatus(false);
                        setListUserLikeId(listUserLikeId.filter(e=> String(e) !== String(hostId)))
                    }
                }
               
            }
        });
    }
  }
  const handleOpenChat = async (userId)=>{
     try{
        if(hostId != userId){
            dispatchredux({type: "OPENCLOSECHAT", payload: { status:true }});
            axios.post(`${url()}/conversations/getListConvByUserId`,{userId:hostId}).then((res)=>{
              if(res && res.data && res.data.data){
                dispatchredux({type: "LISTCONV", payload: { listConv:res.data.data }});
                dispatchredux({type: "COUNTCONVERSATIONUNREADER", payload: { count:res.data.data.filter((e)=> e.unReader == 1).length }});
              }
            }).catch((e)=>{
              console.log(e)
            })
            let dataConv ={};
            let response = await axios.post(`${url()}/conversations/CreateConv`,{
              senderId:hostId,
              receiverId:userId
            });
            if(response && response.data && response.data.data){
                if(Data.listConv.find((e)=>e._id == response.data.data._id)){
                    dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:Data.listConv.find((e)=>e._id == response.data.data._id) }});
                    dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:true }});
                    axios.post(`${url()}/conversations/LoadMessage`,{
                      conversationId:response.data.data._id,
                      userId:hostId,
                      isDevide:true,
                      loaded:0
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
                    dataConv.memberList = [response.data.data.memberList.find((e)=>e.memberId != hostId)];
                    dataConv.messageList = response.data.data.messageList;
                    dataConv.timeLastMessage= response.data.data.messageList[0].createAt;
                    dataConv.unReader =0;
                    dataConv._id = response.data.data._id;
                    dispatchredux({type: "ADDCONV", payload: { newConv:dataConv }});
                    dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:dataConv }});
                    dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:true }});
                    axios.post(`${url()}/conversations/LoadMessage`,{
                      conversationId:response.data.data._id,
                      userId:hostId,
                      isDevide:true,
                      loaded:0
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
  const handleEditComment =() =>{
    setOpenCommentOption(false);
    setcommentMode("editcomment");
    setcommentToEdit(idComment);
    handleEditValueFormComment(content);
  }
  return (
    // nếu lấy dũ liệu từ event mới có đối số từ event truyền vào 
    <div 
        onContextMenu={(e)=>{ 
            e.preventDefault(); // chống cửa sổ mặc định của trình duyệt 
            if(String(hostId) === String(userIdCommented)){
                setOpenCommentOption(true)
            }
            else{
                handleOpenChat(userIdCommented);
            }
        }} className="commentEle">
        {
            openCommentOption && (
                <div className="option_setting_comment">
                    <div onClick={()=>{handleEditComment()}} className="edit_comment">
                        Edit
                    </div>
                    <div 
                        onClick={()=>
                             {
                                if(String(hostId) === String(userIdCommented)){
                                    handleDeleteComment(idComment);
                                }
                             }} 
                        className="delete_comment">
                        Delete
                    </div>
                </div>
            ) 
        }
        <div className="header_commentEle">
           <Link to={`/users/${userIdCommented}`} style={{textDecoration:"none"}}>
                <span className="header_commentEle_child">
                    <img className="img_commentEle" src={linkImgUserComment} alt={nameuser} />
                        <div className="name">
                            {nameuser}
                        </div>
                </span>
            </Link>
        </div>
        <div className="content_commentEle_wrapper">
          <div className="reaction_commentEle_wrapper">
            <div style={{margin:"2px"}}>
                 {
                    (listUserLikeId && listUserLikeId.length) && ( <>{listUserLikeId.length}</>)
                 }
            </div>
            {  
                likeStatus ? (
                    <FavoriteIcon onClick={()=>LikeDislike(false)} className="icon_comment"/>
                ):(
                    <FavoriteBorderIcon onClick={()=>LikeDislike(true)} className="icon_comment" />
                )
            }
            <div onClick={()=>showListUserReaction()} className="see_list_user_like">
               More
            </div>
          </div>
          <p className="content_commentEle">
              {content}
          </p>
          <div className="time">
              <div className="hours">
                  <p>{`${new Date(time).getHours()}:${new Date(time).getMinutes()}`}</p>
                  <p className="day">
                      {`${new Date(time).getDate()}-${new Date(time).getMonth(time)+1}-${new Date(time).getFullYear(time)}`}
                  </p>
              </div>
          </div>
        </div>
        {
            openListUserLike && (
                    <div className="listUserLike_wrapper">
                        <div className="listUserLike">  
                            {   
                                (listUserLikeDetail && listUserLikeDetail.length && (listUserLikeDetail.length>0))
                                && (
                                    listUserLikeDetail.map(userData=>
                                        (
                                            <div key={userData._id} className="user_data_ele_liked">
                                                <Link to={`/users/${userData._id}`}>
                                                    <div className="user_data_ele_liked_name">
                                                        {userData.username}
                                                    </div>
                                                    <img className="user_data_ele_liked_img" alt={userData.username} src={userData.img}/>
                                                </Link>
                                            </div>
                                        )
                                    )
                                )
                            }
                        </div>
                    </div>
                )
            }
        {
            (openListUserLike || openCommentOption) && (
                <div 
                      onClick={()=>{
                            setOpenListUserLike(false);
                            setOpenCommentOption(false)}} 
                      className="listUserLike_blur">
                </div>
            )
        }
        
    </div>
  );
};

export default Comment;

