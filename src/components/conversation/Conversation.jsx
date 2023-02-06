import "./conversation.scss";
import {useState,useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios'
import {url} from '../../config.js'
const Conversation = ({dataConv}) => {
  const { user } = useContext(AuthContext);
  const ReadMessage = ()=>{
    try{
       if(dataConv.unReader == 1){
            axios.post(`${url()}/conversations/ReadMessage`,{
                conversationId:dataConv._id,
                userId:user._id
            }).catch((e)=>{
                console.log(e)
            });
       }
    }
    catch(e){
        console.log(e)
    }
  }
  return (
    <div onClick={()=>ReadMessage()} className="conversation_ele">
        <div className="conv_user_infor">
            <img  className="conv_user_infor_img" src={dataConv.memberList[0].imguser} />
            <div style={(dataConv.unReader == 1) ? {fontWeight:900} : {}} className="conv_user_infor_name">
                    {dataConv.memberList[0].nameuser}
            </div>
        </div>
        <div  style={(dataConv.unReader == 1) ? {fontWeight:800} : {fontWeight:400}} className="infor_mess_conv">
            {/* {dataConv.messageList[0].message} */}
            {
                (dataConv.messageList[0].message.length>20) ?(
                    <div>
                        {dataConv.messageList[0].message.slice(0,20)}...
                    </div>
                ):(
                    <div>
                        {dataConv.messageList[0].message}
                    </div>
                )
            }
        </div>
        <div style={(dataConv.unReader == 1) ? {fontWeight:900} : {}} className="time_last_mess">
            {new Date(dataConv.timeLastMessage).getDate()} Th{new Date(dataConv.timeLastMessage).getMonth() +1} {new Date(dataConv.timeLastMessage).getHours()}:{new Date(dataConv.timeLastMessage).getMinutes()}
        </div>
        <hr style={{color:"black"}} width="100%"/>
    </div>
  );
};

export default Conversation;