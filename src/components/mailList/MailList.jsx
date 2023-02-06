import "./mailList.css"
import { useContext} from "react";
import axios from 'axios'
import {useSelector,useDispatch} from 'react-redux'
import{SearchDataSelector} from '../../redux/selector' // mỗi lần dịch là thay đổi folder cha hiện tại 
import { AuthContext } from "../../context/AuthContext";
import {url} from '../../config.js'
const MailList = () => {
  const Data = useSelector(SearchDataSelector);
  const dispatchredux = useDispatch();  
  const { user } = useContext(AuthContext);
  const handleOpenChat = async (userId)=>{
    try{
      if(user._id != userId){
          dispatchredux({type: "OPENCLOSECHAT", payload: { status:true }});
          axios.post(`${url()}/conversations/getListConvByUserId`,{userId:user._id}).then((res)=>{
            if(res && res.data && res.data.data){
              dispatchredux({type: "LISTCONV", payload: { listConv:res.data.data }});
              dispatchredux({type: "COUNTCONVERSATIONUNREADER", payload: { count:res.data.data.filter((e)=> e.unReader == 1).length }});
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
              if(Data.listConv.find((e)=>e._id == response.data.data._id)){
                  dispatchredux({type: "CHOOSECONV", payload: { conversationChosen:Data.listConv.find((e)=>e._id == response.data.data._id) }});
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
                  dataConv.memberList = [response.data.data.memberList.find((e)=>e.memberId != user._id)];
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
  return (
    <div className="mail">
      <h1 className="mailTitle">Save your time</h1>
      <span className="mailDesc">Sign up and we'll send the best deals to you</span>
      <div className="mailInputContainer">
        <button className="btn_subcribe" onClick={()=>handleOpenChat("6354ece9ebd43c8dd19b1fcc")}>Chat with me</button>
      </div>
    </div>
  )
}

export default MailList