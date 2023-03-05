import "./postele.scss";
import { useContext,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link} from "react-router-dom";
import Comment from "../../components/comment/Comment";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import RawOnIcon from '@mui/icons-material/RawOn';
import MoodIcon from '@mui/icons-material/Mood';
// import FmdGoodIcon from '@mui/icons-material/FmdGood';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import {useSelector,useDispatch} from 'react-redux'
import{SearchDataSelector} from '../../redux/selector' 
import ReplyIcon from '@mui/icons-material/Reply';
import axios from 'axios'
import {url} from '../../config.js'
const PostEle = ({dataPost,setOpenUserTagForm,setMode,setListUserChooseTag, 
      setIdChooseEdit,setOpenFormToCreatePost,setTitle,setListInput,
      setHotelRecommend,setSiteRecommend,setCityRecommend,
      setListFileCreatePost}) => {
  const Data = useSelector(SearchDataSelector);
  const dispatchredux = useDispatch();  
  const { user } = useContext(AuthContext);  // lấy dữ liêuh từ context 
  const [deleteStatus,setDeleteStatus] = useState(false);
  const [openListImg,setOpenListImg] = useState(false);
  const [openBtnListUserLike,setOpenBtnListUserLike] = useState(false);
  const [listUserLike,setListUserLike] = useState([]);
  const [openListUserLike,setOpenListUserLike] = useState(false);
  const [openCommentForm,setOpenCommentForm] = useState(false);
  const [contentComment,setContentComment] = useState("");
  const [listComment,setListComment] = useState([]);
  const [commentReplyMode,setCommentReplyMode] = useState("");
  const [commentEdit,setCommentEdit] = useState("");
  const [likeStatus,setLikeStatus] = useState(dataPost.ListLike.includes(user._id));
  const [countLike,setCountLike] = useState(dataPost.ListLike.length);
  const [openListUserTag,setOpenListUserTag] = useState(false);
  const [openSettingPost,setOpenSettingPost] = useState(false);
  const [emotion,setEmotion] = useState(dataPost.EmotionAuthor ? dataPost.EmotionAuthor : "")
  const [rawSeen,setRawSeen] = useState(dataPost.PermissionSeen ? dataPost.PermissionSeen :"");
  const handleTakeListUserLike = async ()=>{
    try{
        setOpenBtnListUserLike(false)
        let listUser = await axios.post(`${url()}/users/TakeUserInfoByListId`,{users:dataPost.ListLike});
        if(listUser){
           if(listUser.data && listUser.data.data && listUser.data.data.length){
              setListUserLike(listUser.data.data);
              setOpenListUserLike(true)
           }
        }
    } 
    catch(e){
        console.log(e)
    }
  }
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
                    receiverId:userId
                });
                
                if(response && response.data && response.data.data){
                    if(Data.listConv.find((e)=>String(e._id) === String(response.data.data._id))){
                        dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:Data.listConv.find((e)=>String(e._id) === String(response.data.data._id)) }});
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
  const sendComment = async (e)=>{
    try{
        if (String(e.key) === "Enter") {
            let comment = {
                IdPost:dataPost._id,
                content:contentComment,
                userId:user._id,
                userNameComment:user.username,
                imgUserComment:user.img
            }

            if(String(commentReplyMode) === "editcomment" && commentEdit ){
                    axios.post(`${url()}/comments/EditCommentPost`,{IdComment:commentEdit,content:contentComment}).then((res)=>{
                        if(res && res.data && res.data.data){
                            EditCommentListState(commentEdit,res.data.data);
                            setContentComment("")
                            setCommentReplyMode("");
                            }
                    }).catch((e)=>{
                        console.log(e)
                    })
            }
            else{
                
                    axios.post(`${url()}/comments/CreateCommentPost`,comment).then((res,err)=>{
                    if(err){
                        console.log("Không thể gửi comment",err)
                    }
                    else if(res && res.data && res.data.data){
                        setListComment(current => [res.data.data,...current]);
                        setContentComment("")
                    }
                    })
            }
        }
    }
    catch(e){
      console.log(e)
    }

  }
  const handleTakeListCommentPost = async () =>{
    try{
        axios.get(`${url()}/comments/takeListCommentPost/${dataPost._id}`).then((response)=>{
            if(response && response.data && response.data.data){
                setOpenCommentForm(true);
                console.log("Danh sách comment nhận đươc",response.data.data)
                setListComment(response.data.data);
            }
        }).catch((e)=>{console.log(e)})
    }
    catch(e){
        console.log(e)
    }
  }
  const handleDeleteCommentFromDad = async (id) =>{
    try{
        let res = await axios.post(`${url()}/comments/DeleteCommentPost`,{IdComment:id});
        if(res && res.data && res.data.data){
         setListComment((current) =>
            current.filter((e) => String(e._id) !== String(res.data.data))
         );
        }
    }
    catch(e){
      console.log(e)
    }
  }
  const handleLikeDislike = async (status) =>{
    try{
        axios.post(`${url()}/posts/LikeDislikePostEle`,{PostId:dataPost._id,userId:user._id,status}).catch((e)=>{
            console.log(e)
        });
        setLikeStatus(status);
        if(status){
            setCountLike(countLike+1);
        }
        else{
            setCountLike(countLike-1);
        }
    }
    catch(e){
        console.log(e)
    }
  }
  const handleChangePermissionSeen = (content)=>{
    try{
        setRawSeen(content);
        axios.post(`${url()}/posts/EditPermissionPost`,{PostId:dataPost._id,permission:content}).catch((e)=>{console.log(e)})
    }
    catch(e){
        console.log(e)
    }
  }
  const handleEditUserTag = ()=>{
    try{
        setOpenUserTagForm(true);
        setOpenSettingPost(false);
        setListUserChooseTag(dataPost.ListPeopleTag);
        // axios.post(`${url()}/posts/TakeUserTag`,{PostId:dataPost._id}).then((response)=>{
        //     if(response && response.data && response.data.data){
        //         setListUserChooseTag(response.data.data);
        //         setListUserTagChooose(response.data.data);
        //     }
        // })
        setIdChooseEdit(dataPost._id);
        setMode("edit");
    }
    catch(e){
        console.log(e)
    }
  }
  const handleCloseSetting = ()=>{
    try{
        setOpenSettingPost(false);
        // axios.post(`${url()}/posts/TakeUserTag`,{PostId:dataPost._id}).then((response)=>{
        //     if(response && response.data && response.data.data){
        //         setListUserChooseTag(response.data.data);
        //         setListUserTagChooose(response.data.data);
        //     }
        // })
    }
    catch(e){
        console.log(e)
    }
  }
  const handleOpenSetting = ()=>{
    try{
        if(String(dataPost.UserId) === user._id){
            setOpenSettingPost(true)
        }
    }
    catch(e){
        console.log(e)
    }
  }
  const handleChangeEmotion = (content)=>{
    try{
        setEmotion(content);
        axios.post(`${url()}/posts/ChangeEmotion`,{PostId:dataPost._id,emotion:content})
        .catch((e)=>{console.log(e)})
    }
    catch(e){
        console.log(e);
    }
  }
  const handleEditPost = ()=>{
    try{
        setOpenFormToCreatePost(true);
        setOpenSettingPost(false);
        let array =[];
        for(let i=0; i< dataPost.Content.length; i++){
            array.push({
                id:i,
                content:dataPost.Content[i]
            })
        };
        setListInput(array);
        setListFileCreatePost(dataPost.ListImg);
        setTitle(dataPost.Title);
        if(dataPost.CityRecommend && dataPost.CityRecommend.length && (dataPost.CityRecommend.length >0)){
            setCityRecommend(JSON.stringify(dataPost.CityRecommend).replace(/["]/g, ' ').replace('[','').replace(']', ''));
        }
        else{
            setCityRecommend('')
        }

        if(dataPost.HotelRecommend && dataPost.HotelRecommend.length && (dataPost.HotelRecommend.length >0)){
            setHotelRecommend(JSON.stringify(dataPost.HotelRecommend).replace(/["]/g, ' ').replace('[','').replace(']', ''));
        }
        else{
            setHotelRecommend('')
        }

        if(dataPost.SiteRecommend && dataPost.SiteRecommend.length && (dataPost.SiteRecommend.length >0)){
            setSiteRecommend(JSON.stringify(dataPost.SiteRecommend).replace(/["]/g, ' ').replace('[','').replace(']', ''));
        }
        else{
            setSiteRecommend('')
        }

        setIdChooseEdit(dataPost._id);
        setMode("edit");
    }
    catch(e){
        console.log(e)
    }
  }

  const handleDeletePost = async ()=>{
     try{
        setDeleteStatus(true);
        axios.post(`${url()}/posts/DeletePost`,{
            userId:dataPost.UserId,
            postId:dataPost._id
        }).catch((e)=>{console.log(e)})
     }
     catch(e){
         console.log(e)
     }
  }

  const BrokenImageHotel ="https://api-booking-app-aws-ec2.onrender.com/default.png";
  const imageOnErrorHotel = (event) => {
    event.currentTarget.src = BrokenImageHotel;
  };
  const imageOnError = (event) => {
    event.currentTarget.src = BrokenImageHotel;
  };
  return (
    <div>
        
        {
            (!deleteStatus) && (
                <div className="post_ele_wrapper">
                    <div className="post_ele_header">
                        <Link 
                            onContextMenu={(e)=>{ 
                                        e.preventDefault(); 
                                        handleOpenChat(dataPost.UserId);
                                    }}
                            className="post_ele_header_user_info" to={`/users/${dataPost.UserId}`}>
                                <div className="post_ele_header_user_info_img">
                                    <img src={dataPost.LinkImgUserCreate} onError={imageOnErrorHotel} alt=""/>
                                </div>
                                <div style={{textDecoration:"none"}} className="post_ele_header_user_info_name">
                                    {dataPost.UserName} 
                                </div>
                        </Link>
                        <div style={{cursor:"pointer",width: "150px"}} className="post_ele_header_time">
                            {new Date(dataPost.CreateAt).getDate()} Th{new Date(dataPost.CreateAt).getMonth()+1}
                        </div>
                    </div>
                    <div className="Post_ele_option">
                        {
                            (dataPost.EmotionAuthor && ( String(dataPost.EmotionAuthor.trim()) !== "") && (dataPost.ListPeopleTag.length > 1)) && (
                                <div className="Post_ele_option_wrapper" >
                                    <div className="Post_ele_option_wrapper_1" >
                                        Feeling {emotion} with
                                    </div>
                                    <div className="Post_ele_option_wrapper_2" >
                                        <Link to={`/users/${dataPost.ListPeopleTag[0].userId}`} style={{textDecoration: "none"}}>
                                            {dataPost.ListPeopleTag[0].username}
                                        </Link>
                                    
                                    </div>
                                    <div className="Post_ele_option_wrapper_3" >
                                        and 
                                    </div>
                                    <div onClick={()=> {  
                                                        setOpenListUserTag(true);
                                                        }} 
                                        className="Post_ele_option_wrapper_4" >
                                        <>
                                            {
                                                (dataPost.ListPeopleTag.length -1 >1) ?
                                                (
                                                <>
                                                    {dataPost.ListPeopleTag.length -1 } others
                                                </>
                                                ):
                                                (
                                                <>
                                                    {dataPost.ListPeopleTag.length -1 } other
                                                </>
                                                )
                                            }
                                            {
                                            openListUserTag && (
                                                <div className="List_user_tag">
                                                    <div className="list_user_tag_tempt">
                                                            {dataPost.ListPeopleTag.filter((e)=> String(e.userId) !== String(dataPost.ListPeopleTag[0].userId)).map((obj,index)=>(
                                                                    <div className="user_tag_ele" key={index}>
                                                                        <Link className="user_tag_ele_link_wrapper" to={`/users/${obj.userId}`}>
                                                                            <img className="user_tag_ele_img" src={obj.img} onError={imageOnErrorHotel} alt="" />
                                                                            <div className="user_tag_ele_username"> 
                                                                                    {obj.username}
                                                                            </div>
                                                                        </Link>
                                                                    </div>
                                                            ))
                                                            }
                                                    </div>
                                                </div>
                                            )
                                            }
                                        </>
                                    </div>
                                    
                                </div>
                            )
                        }
                        {
                            (dataPost.EmotionAuthor && ( String(dataPost.EmotionAuthor.trim()) !=="") && (Number(dataPost.ListPeopleTag.length) === 1)) && (
                                <div className="Post_ele_option_wrapper" >
                                    <div className="Post_ele_option_wrapper_1" >
                                        Feeling {dataPost.EmotionAuthor} with
                                    </div>
                                    <div className="Post_ele_option_wrapper_2" >
                                        <Link to={`/users/${dataPost.ListPeopleTag[0].userId}`} style={{textDecoration: "none"}}>
                                            {dataPost.ListPeopleTag[0].username}
                                        </Link>
                                    </div>
                                </div>
                            )
                        }
                        {
                            (dataPost.EmotionAuthor && (String(dataPost.EmotionAuthor.trim()) !== "")  && ( Number(dataPost.ListPeopleTag.length) === 0)) && (
                                <div className="Post_ele_option_wrapper" >
                                    <div className="Post_ele_option_wrapper_1" >
                                        Feeling {dataPost.EmotionAuthor} 
                                    </div>
                                </div>
                            )
                        }
                        {
                            (((!dataPost.EmotionAuthor) || ( String(dataPost.EmotionAuthor.trim()) === "") ) && (Number(dataPost.ListPeopleTag.length) === 1)) && (
                                <div className="Post_ele_option_wrapper" >
                                <div className="Post_ele_option_wrapper_2" >
                                        <Link to={`/users/${dataPost.ListPeopleTag[0].userId}`} style={{textDecoration: "none"}}>
                                            With {dataPost.ListPeopleTag[0].username}
                                        </Link>
                                    </div>
                                </div>
                            )
                        }
                        {
                            (((!dataPost.EmotionAuthor) || ( String(dataPost.EmotionAuthor.trim()) === "") ) && (dataPost.ListPeopleTag.length > 1)) && (
                                <div className="Post_ele_option_wrapper" >
                                    <div className="Post_ele_option_wrapper_2" >
                                        <Link to={`/users/${dataPost.ListPeopleTag[0].userId}`} style={{textDecoration: "none"}}>
                                        With {dataPost.ListPeopleTag[0].username}
                                        </Link>
                                    
                                    </div>
                                    <div className="Post_ele_option_wrapper_3" >
                                        and 
                                    </div>
                                    <div onClick={()=> setOpenListUserTag(true)} className="Post_ele_option_wrapper_4" >
                                        <>
                                            {
                                                (dataPost.ListPeopleTag.length -1 >1) ?
                                                (
                                                <>
                                                    {dataPost.ListPeopleTag.length -1 } others
                                                </>
                                                ):
                                                (
                                                <>
                                                    {dataPost.ListPeopleTag.length -1 } other
                                                </>
                                                )
                                            }
                                            {
                                            openListUserTag && (
                                                <div className="List_user_tag">
                                                    <div className="list_user_tag_tempt">
                                                            {dataPost.ListPeopleTag.filter((e)=> String(e.userId) !== String(dataPost.ListPeopleTag[0].userId)).map((obj,index)=>(
                                                                    <div className="user_tag_ele" key={index}>
                                                                        <Link className="user_tag_ele_link_wrapper" to={`/users/${obj.userId}`}>
                                                                            <img className="user_tag_ele_img" src={obj.img} onError={imageOnErrorHotel} alt=""/>
                                                                            <div className="user_tag_ele_username">
                                                                                    {obj.username}
                                                                            </div>
                                                                        </Link>
                                                                    </div>
                                                            ))
                                                            }
                                                    </div>
                                                </div>
                                            )
                                            }
                                        </>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                
                    {
                        (dataPost.CityRecommend && dataPost.CityRecommend.length && (dataPost.CityRecommend.length >0) && (JSON.stringify(dataPost.CityRecommend).includes(']'))) ? (
                            <div className="city_recommend">
                                #{JSON.stringify(dataPost.CityRecommend).replace(/["]/g, ' ').replace('[','').replace(']', '')}
                            </div>
                        ):(<></>)
                    }
                    
                    {
                        (dataPost.HotelRecommend && dataPost.HotelRecommend.length && (dataPost.HotelRecommend.length >0) && (JSON.stringify(dataPost.HotelRecommend).includes(']'))) ? (
                            <div className="hotel_recommend">
                                #{JSON.stringify(dataPost.HotelRecommend).replace(/["]/g, ' ').replace('[','').replace(']', '')}
                            </div>
                        ): (
                            <></>
                        )
                    }
                    
                    {
                        (dataPost.SiteRecommend && dataPost.SiteRecommend.length && (dataPost.SiteRecommend.length >0) && (JSON.stringify(dataPost.SiteRecommend).includes(']'))) ? (
                            <div className="site_recommend">
                                #{JSON.stringify(dataPost.SiteRecommend).replace(/["]/g, ' ').replace('[','').replace(']', '')}
                            </div>
                        ):(<></>)
                    }
                    <div className="post_ele_title">
                        {dataPost.Title}
                    </div>
                    <div className="post_content">
                        {
                            dataPost.Content.map((item, index) => (
                                <div className="content_ele" key={index}>
                                    {item}
                                </div>
                            ))
                        }
                    </div>
                    <hr  width="100%" align="center" />
                    <div className="post_ele_img">
                        {
                            (( Number(dataPost.ListImg.length) !== 1) && ( Number(dataPost.ListImg.length) !== 0)) && (
                                <div className="post_ele_img1">
                                    {
                                        (dataPost.ListImg.length > 0)?(
                                            <img  onError={imageOnError} src={dataPost.ListImg[0]} alt=""/>
                                        ):(
                                            <img  onError={imageOnError} src="https://img.meta.com.vn/Data/image/2022/01/13/anh-dep-thien-nhien-5.jpg" alt=""/>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            (Number(dataPost.ListImg.length) !== 0) && (
                                <div onClick={()=>setOpenListImg(true)} className="post_ele_img2">
                                    {
                                        (dataPost.ListImg.length >1) && (
                                            <div className="post_ele_img2_blur"></div>
                                        )
                                    }
                                    {
                                        (dataPost.ListImg.length >1) && (
                                            <>
                                                {
                                                    (dataPost.ListImg.length >1) ?(
                                                        <div className="count_img"> {dataPost.ListImg.length -1}+ </div>
                                                    ):(
                                                        <div className="count_img"> 0+ </div>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                    {
                                        (dataPost.ListImg.length >1) ?(
                                            <img src={dataPost.ListImg[1]} alt=""/>
                                        ):(
                                            <>
                                            {
                                                (Number(dataPost.ListImg.length) === 1) ?(
                                                    <img  onError={imageOnError} src={dataPost.ListImg[0]} alt="" />
                                                ):(
                                                    <img  onError={imageOnError} src="https://img.meta.com.vn/Data/image/2022/01/13/anh-dep-thien-nhien-5.jpg" alt=""/>
                                                )
                                            }
                                            </>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                    <div className="post_btn_wrapper">
                        <div  onContextMenu={(e)=>{ e.preventDefault(); setOpenBtnListUserLike(true) }} 
                            className="post_btn_like">
                            {
                                openBtnListUserLike && (
                                    <div onClick={()=>handleTakeListUserLike()} className="post_btn_like_see_listuser">More</div>
                                )
                            }
                            <div className="count_like">
                                {countLike}
                            </div>
                            {
                                likeStatus ? (
                                    <ThumbUpIcon onClick={()=>handleLikeDislike(false)} style={{margin:"10px 10px",color:"rgba(0, 0, 235, 0.9)"}}/>
                                ):(
                                    <ThumbUpOutlinedIcon onClick={()=>handleLikeDislike(true)} style={{margin:"10px 10px",color:"rgba(0, 0, 235, 0.9)"}}/>
                                )
                            }
                        </div>
                        <div onClick={()=>handleTakeListCommentPost()} className="post_btn_comment">
                            <ChatBubbleOutlineIcon style={{margin:"10px 10px",color:"rgba(0, 0, 235, 0.9)"}}/>
                        </div>
                        <div className="post_btn_share">
                            <ReplyIcon style={{margin:"10px 10px",color:"rgba(0, 0, 235, 0.9)"}}/>
                        </div>
                    </div>
                    <div className="option_setting_post">
                    {
                        (!openSettingPost) && (
                            <ListIcon onClick={()=>handleOpenSetting()} className="option_setting_post_icon" />
                        )
                    }
                    {
                        (openSettingPost) && (
                            <CloseIcon  onClick={()=>handleCloseSetting()} className="option_setting_post_icon" />
                        )
                    }
                    {
                        (openSettingPost) && (
                            <div className="option_setting_tempt">
                                    <div className="option_setting_form">
                                        <div className="option_setting_form_ele" id="permission_setting_btn">
                                            <div className="text" >
                                                Permission
                                            </div>
                                            <RawOnIcon className="icon"/>
                                            <div className="direction">
                                                <ArrowBackIosNewIcon className="direction_icon"/>
                                            </div>
                                            <hr className="hr_ele"/>
                                            <select 
                                                value={rawSeen}
                                                onChange={(e)=>handleChangePermissionSeen(e.target.value)}
                                                name="raw" id="raw_setting" >
                                                <option value="Personal">Personal</option>
                                                <option value="Friend">Friend</option>
                                                <option value="Public">Public</option>
                                            </select>
                                        </div>
                                        <div 
                                            onClick={()=>handleEditUserTag()}
                                            className="option_setting_form_ele">
                                            <div className="text" >
                                                Tag
                                            </div>
                                            <LocalOfferIcon className="icon"/>
                                            <div className="direction">
                                                <ArrowBackIosNewIcon className="direction_icon"/>
                                            </div>
                                            <hr className="hr_ele"/>
                                        </div>
                                        <div id="option_setting_emotion"
                                            className="option_setting_form_ele">
                                            <div className="text" >
                                                Emotion
                                            </div>
                                            <MoodIcon className="icon"/>
                                            <div className="direction">
                                                <ArrowBackIosNewIcon className="direction_icon"/>
                                            </div>
                                            <select 
                                                value={emotion}
                                                onChange={(e)=>handleChangeEmotion(e.target.value)}
                                                name="emotion" id="emotion_setting" >
                                                <option value="happy">happy</option>
                                                <option value="angry">angry</option>
                                                <option value="sad">sad</option>
                                                <option value="tired">tired</option>
                                            </select>
                                            <hr className="hr_ele"/>
                                        </div>
                                        <div 
                                            onClick={()=>handleEditPost()}
                                            className="option_setting_form_ele">
                                            <div className="text" >
                                                Edit
                                            </div>
                                            <EditIcon className="icon"/>
                                            <div className="direction">
                                                <ArrowBackIosNewIcon className="direction_icon"/>
                                            </div>
                                            <hr className="hr_ele"/>
                                        </div>
                                        <div 
                                            onClick={()=>handleDeletePost()}
                                            className="option_setting_form_ele">
                                            <div 
                                                id="deletePost_btn_text"
                                                className="text" >
                                                Delete
                                            </div>
                                            <DeleteIcon className="icon" id="deletePost_btn_icon"/>
                                            <div className="direction">
                                                <ArrowBackIosNewIcon className="direction_icon"/>
                                            </div>
                                            <hr className="hr_ele"/>
                                        </div>
                                    </div>
                            </div>
                        )
                    }
                    </div>
                    {
                        (openListImg ) && (
                            <div className="listImage">
                                <div className="listImage_temp">
                                    {
                                        dataPost.ListImg.map(imgSource=>
                                            ( <div key={imgSource} className="img_listImage_wrapper">
                                                <img  onError={imageOnError} src={imgSource} className="img_listImage" alt=""/>
                                            </div>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    {
                        (openListUserLike && (listUserLike.length>0)) && (
                        <div className="list_user_voted">
                            {
                                listUserLike.map(user=>
                                    (
                                        <Link key={user._id} to={`/users/${user._id}`}>
                                            <div className="user_vote_element">
                                                <img className="img_vote_element" src={user.img} alt={user.username} onError={imageOnErrorHotel}/>
                                                <div className="name_vote_element">{user.username}</div>
                                            </div>
                                        </Link>
                                    )
                                    )
                            }
                        </div>
                        )
                    }
                    {
                        openCommentForm && (
                            <div className="comment_form">
                                <div className="comment_form_wrapper">
                                    <div className="commentList_wrapper">
                                    {
                                            [...new Map(listComment.map((item) => [item["_id"], item])).values()].map(comment=>
                                            (
                                                <Comment 
                                                    className="comment_ele"
                                                    key={comment._id} 
                                                    idComment={comment._id}
                                                    nameuser={comment.userNameComment} 
                                                    imgsource={comment.imgUserComment} 
                                                    content={comment.content} 
                                                    time={comment.createAt} 
                                                    listUserLike ={comment.emotion}
                                                    hostStatus ={comment.emotion.includes(user._id)}
                                                    hostId={user._id}
                                                    userIdCommented={comment.userId}
                                                    handleEditValueFormComment= {setContentComment}
                                                    setcommentMode={setCommentReplyMode}
                                                    setcommentToEdit = {setCommentEdit}
                                                    handleDeleteComment={handleDeleteCommentFromDad}
                                                    typeComment="post"
                                                    // listUserCare = {listUserCare}
                                                />
                                            )
                                            )
                                        }
                                    </div>
                                    <div className="comment_form_inout">
                                        <input 
                                            placeholder="type your comment"
                                            value={contentComment}
                                            onChange={(e)=>{setContentComment(e.target.value)}}
                                            onKeyPress={(e) => sendComment(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {/*background blur*/}
                    {
                        (openListImg || openBtnListUserLike || openListUserLike || openCommentForm || openListUserTag) && (
                        <div 
                            onClick={()=> {
                                        setOpenListUserTag(false);
                                        setOpenListImg(false);
                                        setOpenBtnListUserLike(false);
                                        setOpenListUserLike(false);
                                        setOpenCommentForm(false);
                                        }} 
                            className="background_blur">
                        </div>
                        )
                    }
                </div>
            )
        }
    </div>
  );
};

export default PostEle;