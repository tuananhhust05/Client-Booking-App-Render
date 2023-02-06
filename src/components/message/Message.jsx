import "./message.scss";
import { useContext,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {url} from '../../config.js'
import {socketCient} from '../../config.js'
import axios from 'axios'
const Message = ({dataMess,dataConv}) => {
  let socket = socketCient();
  const [openMessageOption,setOpenMessageOption] = useState(false);
  const [isDeleted,setIsDeleted] = useState(false)
  const { user } = useContext(AuthContext);
  const handleDeleteMessage = ()=>{
    try{
      setIsDeleted(true);
      setOpenMessageOption(false);
      axios.get(`${url()}/conversations/DeleteMessage/${dataMess.messageId}/${dataConv._id}`);
      socket.emit("DeleteMessage",dataConv.memberList[0].memberId,dataConv._id,dataMess.messageId)
    }
    catch(e){
      console.log(e);
    }
  }

  return (
    <div 
        onContextMenu={(e)=>{ 
            e.preventDefault(); 
            if(String(user._id) === String(dataMess.senderId)){
                setOpenMessageOption(true)
            }
        }}
        style={isDeleted ? {display:"none"} : {}}
        className={(dataMess.senderId != user._id) ? 'message' : 'message right'} >
        <div className="sender_infor">
            {
              (dataMess.senderId != user._id) && (
                <>
                    <div className="img_sender">
                        <img src={dataConv.memberList[0].imguser}/>
                    </div>
                    <div className="sender_name">
                        {dataConv.memberList[0].nameuser}
                    </div>
                </>
              )
            }
            <div className="time_send_mess">
                      {new Date(dataMess.createAt).getHours()}:{new Date(dataMess.createAt).getMinutes()} {new Date(dataMess.createAt).getDate()}Th{new Date(dataMess.createAt).getMonth()}
            </div>
        </div>
         <div className="message_content">
              {dataMess.message} 
         </div>
         {
          openMessageOption && (
            <div className="option_setting_message">
              <div onClick={()=>handleDeleteMessage()} className="delete_message">
                    Delete
              </div>
           </div>
          )
         }
         {
            openMessageOption && (
              <div onClick={()=>setOpenMessageOption(false)} className="message_blur">
              </div>
            )
         }
    </div>
  );
};

export default Message;