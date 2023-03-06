import "./singleuser.scss";
import Header from "../../components/header/Header";
import Comment from "../../components/comment/Comment";
import Notification from "../../components/notification/Notification";
import FileUploadIcon from '@mui/icons-material/FileUpload';
// import SendIcon from '@mui/icons-material/Send';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CancelIcon from '@mui/icons-material/Cancel';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState,useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useDropzone } from "react-dropzone"
import axios from "axios";
import {url} from '../../config.js'
// import {socketCient} from '../../config.js'
import {useSelector,useDispatch} from 'react-redux'
import{SearchDataSelector} from '../../redux/selector'
const Singleuser = () => {
  // let socket = socketCient();
  const Data = useSelector(SearchDataSelector);
  const dispatchredux = useDispatch();  
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  // chỉ hiển thị thông tin về khách sạn và loại phòng 
  const navigate = useNavigate();
  const location = useLocation(); 
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];  // id khách sạn 

  const [data,setData] = useState({}); // chung => sau đặt lại tên biến
  const [listComment,setListComment] = useState([]);

  // vote 
  const [openListUserVote,setOpenListUserVote] = useState(false);
  const [openListImage,setOpenListImage] = useState(false)
  
  // edit hotel Infomation 
  const [openEditForm,setOpenEditForm] = useState(false);
  
  // data để edit thông tin khách sạn 
  const [dataUserToEdit,setDataUserToEdit] = useState({})
  // nhập phản hồi 
  const [commentReply,setCommentReply] = useState("");

  // edit comment 
  const [commentReplyMode,setCommentReplyMode] = useState("");
  const [commentEdit,setCommentEdit] = useState(null); // là id thôi 
  
  // list room 
  const [openListRoom,setOpenListRoom] = useState(false);

  // const [ listUserCare, setListUserCare] =useState([]);
  const listUserCare = [];
  // change pass
  const [dataToChangePass,setDataToChangePass] = useState({
    passold:"",
    passnew:"",
    repassnew:""
  })
  const [ openFormChangePass, setOpenFormChangePass] =useState(false);

  const [showNotification,setShowNotification] = useState(false);
  const [contentNotification,setContentNotification]= useState("");
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
     if(String(path) === "users"){
        comment = {
          content:commentReply,
          createAt: new Date(),
          emotion:"",
          userIdHostPage:id,
          userId:user._id
        }
      }
      if(String(commentReplyMode) === "editcomment" && commentEdit ){
          if(String(path) === "users"){
            let res = await axios.post(`${url()}/comments/EditCommentPersonalPage`,{IdComment:commentEdit,content:commentReply});
            if(res && res.data && res.data.data){
              EditCommentListState(commentEdit,res.data.data);
              setCommentReply("");
              setCommentReplyMode("");
            }
          }
      }
      else{
          if(String(path) === "users"){
            axios.post(`${url()}/comments/CreateCommentPersonalPage`,comment).then((res,err)=>{
              if(err){
                console.log("Không thể gửi comment",err)
              }
              else if(res && res.data && res.data.data){
                setListComment(current => [res.data.data,...current]);
                setCommentReply("");
              }
            })
      }
      }
    }
    catch(e){
      console.log(e)
    }

  }
  
  const handleDeleteCommentFromDad = async (id) =>{
    try{
      if(String(path)=== "users"){
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
      if (String(location.pathname.split("/")[1]) === "users"){
          let res = await axios.get(`${url()}/users/${id}`);
          if(res && res.data){
            setData(res.data);
            setDataUserToEdit(res.data)
          }

           // dữ liệu về comment 
           const res2 = await axios.get(`${url()}/comments/TakeListCommentPersonalPage/${id}`); 
           if(res2.data && res2.data.data){
              setListComment(res2.data.data);
           }

        }
      }
    try{
      takeData();
    }
    catch(e){
      navigate("/");
      console.log(e);
    }
  },[id,location.pathname,navigate])



  const handleChangeValueEdit = (value,field)=>{

    if (String(location.pathname.split("/")[1]) === "users"){
      setDataUserToEdit((prev) => {
        return {
          ...prev, 
          [field]: value,
        };
      });
    }
  }
  const handleChangeValueChangePass = (value,field)=>{
      setDataToChangePass((prev) => {
        return {
          ...prev, 
          [field]: value,
        };
      });

  }

  const handleSendEdit = async ()=>{
     try{
      setOpenEditForm(false);
      if (String(location.pathname.split("/")[1]) === "users"){
        if( String(id) === String(user._id)){
          let res = await axios.put(`${url()}/users/${id}`,dataUserToEdit);
          if(res && res.data){
            setData(res.data);
            setDataUserToEdit(res.data)
          }
        }
      }
     }
     catch(e){
      console.log(e)
     }
  }
  const handleSendChangePass = async ()=>{
    try{
       setOpenFormChangePass(false);
       if(dataToChangePass.passold && dataToChangePass.passnew && dataToChangePass.repassnew && user && user._id){
          if(String(dataToChangePass.repassnew) === String(dataToChangePass.passnew)){
              if(String(dataToChangePass.passold) !== String(dataToChangePass.passnew)){
                  let dataSend ={
                      _id:user._id,
                      passold:dataToChangePass.passold,
                      passnew:dataToChangePass.passnew,
                      repassnew:dataToChangePass.repassnew,
                  }
                  axios.post(`${url()}/auth/changePass`,dataSend).then((response)=>{
                    if(response && response.data && response.data.data){
                        setShowNotification(true);
                        // const timer = setTimeout(() => {
                        //   setShowNotification(false);
                        // }, 5000);
                        setTimeout(() => {
                          setShowNotification(false);
                        }, 5000);
                        setContentNotification("Updated successfully");
                        setDataToChangePass({
                          passold:"",
                          passnew:"",
                          repassnew:""
                        })
                    }
                    else{
                        setShowNotification(true);
                        setTimeout(() => {
                          setShowNotification(false);
                        }, 5000);
                        setContentNotification("Updated failed");
                        setDataToChangePass({
                          passold:"",
                          passnew:"",
                          repassnew:""
                        })
                    }
                  }).catch((e)=>{
                      setShowNotification(true);
                      // const timer = setTimeout(() => {
                      //   setShowNotification(false);
                      // }, 5000);
                      setTimeout(() => {
                        setShowNotification(false);
                      }, 5000);
                      setContentNotification("Updated failed");
                      setDataToChangePass({
                        passold:"",
                        passnew:"",
                        repassnew:""
                      })
                  })
              }
              else{
                setShowNotification(true);
                // const timer = setTimeout(() => {
                //   setShowNotification(false);
                // }, 5000);
                setTimeout(() => {
                  setShowNotification(false);
                }, 5000);
                setContentNotification("New password is similar to old password");
                setDataToChangePass({
                  passold:"",
                  passnew:"",
                  repassnew:""
                })
              }
          }
          else{
            setShowNotification(true);
            // const timer = setTimeout(() => {
            //   setShowNotification(false);
            // }, 5000);
            setTimeout(() => {
              setShowNotification(false);
            }, 5000);
            setContentNotification("New password is not similar to old password");
            setDataToChangePass({
              passold:"",
              passnew:"",
              repassnew:""
            })
          }
       }
    }
    catch(e){
       console.log(e)
    }
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
          if(listType.find((e)=> String(e) === String(type))){
            formData.append("files",pic);
          }
        });
        formData.append("userId",user._id);
        axios.post(`${url()}/users/UploadAvartar`, formData, config)
        .then(async (response) => {
          if (response && response.data && response.data.data) {
            let newuser = user;
            newuser= {...newuser,img:response.data.data};
            setData(newuser);
            dispatch({ type: "LOGIN_SUCCESS", payload: newuser }); 
            localStorage.setItem("user", JSON.stringify(newuser));
          }
        }).catch((e)=>{
          console.log(e)
        })
    }
  }); 
  
  const handleOpenChat = async (userId)=>{
    try{
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
            receiverId:userId,
            isDevide:true,
            loaded:0
          });
          
          if(response && response.data && response.data.data){
              if(Data.listConv.find((e)=>String(e._id) === String(response.data.data._id))){
                  dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:Data.listConv.find((e)=>String(e._id) === String(response.data.data._id)) }});
                  dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:true }});
                  axios.post(`${url()}/conversations/LoadMessage`,{
                    conversationId:response.data.data._id,
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
                      }
                  }).catch((e)=>{
                    console.log(e)
                  });
              }
              else{
                  dataConv.memberList = [response.data.data.memberList.find((e)=>String(e.memberId) !== String(user._id))];
                  dataConv.messageList = response.data.data.messageList;
                  dataConv.timeLastMessage= response.data.data.messageList[0].createAt;
                  dataConv.unReader =0;
                  dataConv._id = response.data.data._id;
                  dispatchredux({type: "ADDCONV", payload: { newConv:dataConv }});
                  dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:dataConv }});
                  dispatchredux({type: "CHANGECHATMODE", payload: { chatMode:true }});
                  axios.post(`${url()}/conversations/LoadMessage`,{
                    conversationId:response.data.data._id,
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

  const BrokenImage ="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png";
  const imageOnError = (event) => {
    event.currentTarget.src = BrokenImage;
  };
  return (
    <div className="single">
      <Header type="list" />
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div onClick={()=>setOpenEditForm(true)} className="editButton">Edit</div>
            <h1 className="title">Informations</h1>
            {
              (String(path) === "users") &&(
                  (data !== {}) && (
                      <div className="item">
                          <img
                            src={data.img ? data.img : ""}
                            alt=""
                            className="itemImg"
                            onError = {imageOnError}
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
                            {
                              (String(user._id) !== String(id)) && (
                                <div className="detailItem"  onClick={()=>handleOpenChat(id)} >
                                  <span className="itemKey">Chat with me</span>
                                  <span className="itemValue">
                                  </span>
                                </div>
                              )
                            }

                            <div className="detailItem">
                              <span className="itemKey">Phone:</span>
                              <span className="itemValue">
                                  {data.phone}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="itemKey">Ad:</span>
                              <span className="itemValue">
                                  {data.isAdmin ? "Yes" :"No"}
                              </span>
                            </div>
                            
                           {
                             (String(id) === String(user._id)) && (
                              <div 
                                  onClick={()=>setOpenFormChangePass(true)}
                                  className="detailItem changePassBtn">
                                <span className="itemKey">Change Password</span>
                              </div>
                             )
                           }
                          </div>
                      </div>
                  )
              )
            }
          </div>
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
        (openFormChat) && (
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

      {/*background blur*/}
      {
        (openListUserVote || openListImage ||openEditForm || openListRoom ||openFormChangePass ) && (
          <div 
             onClick={()=> {
                             setOpenListUserVote(false);
                             setOpenListImage(false);
                             setOpenEditForm(false);
                             setOpenListRoom(false);
                             setOpenFormChangePass(false)
                           }} 
             className="background_blur">
          </div>
        )
      }
      {
        openFormChangePass && (
          <div className="form_change_pass">
              {
                (path === "users") && (
                  <>
                    <input
                      type="password"
                      placeholder="passold"
                      id="passold"
                      value ={dataToChangePass.passold}
                      onChange= {(e)=>handleChangeValueChangePass(e.target.value,e.target.id)}
                      className="lInput"
                    />
                    <input
                      type="password"
                      placeholder="passnew"
                      id="passnew"
                      onChange= {(e)=>handleChangeValueChangePass(e.target.value,e.target.id)}
                      value ={dataToChangePass.passnew}
                      className="lInput"
                    />
                    <input
                      type="password"
                      placeholder="repassnew"
                      id="repassnew"
                      onChange= {(e)=>handleChangeValueChangePass(e.target.value,e.target.id)}
                      value={dataToChangePass.repassnew}
                      className="lInput"
                    /> 
                    
                    <button onClick={()=>handleSendChangePass()} className="submit">Submit</button>
                  </>
                )
              }
              </div>
        )
      }
      {
        showNotification && (
          <Notification content={contentNotification} />
        )
      }
      {
        openEditForm && (
          <div className="editForm">

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
                  <div 
                        {...getRootProps({ className: "small_dropzone" })}
                        className="upload_file">
                          <input className="small_dropzone" {...getInputProps()} />
                          <FileUploadIcon/>
                          <div className="decription_btn">
                              Upload Avatar
                          </div>
                    </div>
                  <button onClick={()=>handleSendEdit()} className="submit">Submit</button>
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

export default Singleuser;
