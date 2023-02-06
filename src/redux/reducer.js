
// nạp dữ liệu mặc định cho state
const INITIAL_STATE = {
    destination:  null,
    date: [],
    options: {
      adult: null,
      children:  null,
      room:  null,
    },
    isOpenChat:false,
    listOrder:[],
    listNotification:[],
    countConversationUnreader:0,
    listConv:[],
    chatMode:false,
    conversationChosen:{},
    listMess:[]
};
// { destination, date, options }
// reducer bản chất là 1 hàm nhận vào 2 đối số
// đẩy dữ liệu mặc định vào store 
const SearchReducerRedux = (state =INITIAL_STATE, action) => {  // state lấy mặc định từ store 
    switch (action.type) {
      case "ADDMESS":
        return { 
          ...state, 
          listMess: (state.chatMode && state.conversationChosen._id && (state.conversationChosen._id == action.payload.newMess.conversationId)) ? [action.payload.newMess,...state.listMess] : state.listMess,
          countConversationUnreader: (state.chatMode && state.conversationChosen._id && (state.conversationChosen._id == action.payload.newMess.conversationId)) ? state.countConversationUnreader : (state.countConversationUnreader + 1),
          listConv: state.listConv.map(
            (conv, i) => conv._id == action.payload.newMess.conversationId ? 
                                     {
                                       unReader:1,
                                       _id:action.payload.newMess.conversationId,
                                       timeLastMessage:action.payload.newMess.createAt,
                                       memberList:conv.memberList,
                                       messageList:[action.payload.newMess],
                                     }
                                    : conv
          )
        }
      case "LISTMESS":
        return { 
          ...state, 
          listMess: action.payload.listMess
        }
      case "ADDCONV":
        return { 
          ...state, 
          listConv: [action.payload.newConv,...state.listConv]
        }
      case "CHOOSECONV":
        return { 
          ...state, 
          conversationChosen: action.payload.conversationChosen
        }
      case "CHANGECHATMODE":
        return { 
          ...state, 
          chatMode: action.payload.chatMode
        }
      case "COUNTCONVERSATIONUNREADER":
        return { 
          ...state, 
          countConversationUnreader: action.payload.count
        }
      case "LISTCONV":
        return { 
          ...state, 
          listConv: action.payload.listConv
        }
      case "UPDATELISTCONV":
        return { 
          ...state, 
          listConv: state.listConv.map(
            (conv, i) => conv._id == action.payload.idconv ? action.payload.updateConv
                                    : conv
          )
        }
      case "CHANGECONVERSATIONUNREADER":
        return { 
          ...state, 
          countConversationUnreader: state.countConversationUnreader + action.payload.count
        }
      
      case "LISTORDER":
        return { 
          ...state, 
          listOrder: action.payload.listOrder
        }
      case "OPENCLOSECHAT":
        return{
          ...state, 
          isOpenChat: action.payload.status 
        } 
      case "ADDORDER":
        return{
          ...state, 
          status:"Thành công",
          listOrder: [action.payload.newOrder,...state.listOrder]
        } 
      case "UPDATEORDER":
        return{
          ...state, 
          status:"Thành công",
          listOrder: state.listOrder.map(
            (order, i) => order._id == action.payload.IdOrder ? {...order, Status: action.payload.Status}
                                    : order
          )
        } 
      
      case "LISTNOTIFICATION":
        return { 
          ...state, 
          listNotification: action.payload.listNotification
        }
      case "ADDNOTIFICATION":
        return { 
          ...state, 
          listNotification: [action.payload.newNotification,...state.listNotification]
        }
      case "READNOTIFICATION":
        return { 
          ...state, 
          listNotification: state.listNotification.map(
            (notification, i) => notification._id == action.payload.idNotify ? {...notification, Status: 0}
                                    : notification
          )
        }
      case "NEW_SEARCH":
        return { 
          ...state, 
          destination: action.payload.destination,
          date: action.payload.date,
          options: action.payload.options,
        }
      case "RESET_SEARCH":
        return INITIAL_STATE;
      default: // luôn phải set default action
        return state;
    }
};
export default SearchReducerRedux;