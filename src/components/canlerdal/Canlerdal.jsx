import "./Canlerdal.scss";
import { useState  } from "react";
import axios from 'axios'
import {url} from '../../config.js'
import {socketCient} from '../../config.js'
import {useDispatch} from 'react-redux' // redux 
const Canlerdal = ({month,year,arrayDayUnAvailability,handleChangeDayUnAvailability,IdRoomNumber,
                   RoomNumber,CategoryRoomId,CategoryRoomDesc,UserOrderId,
                   PhoneUserOrder,NameUserOrder,EmailUserOrder,ImgUserOrder,PhoneContactExtra,
                   PricePerDay, HotelId,OwnerId,
                   HotelName,
                  }) => {
  let socket = socketCient();
  const dispatchredux = useDispatch();  // redux 
  const today = {day:new Date().getDate(),month:new Date().getMonth()+1,year:new Date().getFullYear()};
  // 1 lớn hơn là true 
  const compareTwoDate = (date1, date2) =>{
     try{
        if(Number(date1.year) === Number(date2.year)){
            if(Number(date1.month) === Number(date2.month)){
                if(Number(date1.day) === Number(date2.day)){
                     return false;
                }
                else if(Number(date1.day) > Number(date2.day)){
                     return true;
                }
                else{
                     return false;
                }
            }
            else if(Number(date1.month) > Number(date2.month)){
                return true;
            }
            else{
                return false;
            }
        }
        else if( Number(date1.year) > Number(date2.year) ){
            return true;
        }
        else{
            return false;
        }
     }
     catch(e){
        console.log(e)
        return false;
     }
  }
  const get_day_of_month = (monthIn,yearIn) => {
    try{
      return new Date(yearIn, monthIn, 0).getDate();
    }
    catch(e){
      return 0
    }
  };
  const takeArrayDayOnMonth = (monthInput,yearInput) =>{
    let array_day = [];
    for(let i=1; i<=get_day_of_month(monthInput,yearInput);i++){
      array_day.push(i)
    }
    return array_day
  }
  
  const [monthIntern,setMonthIntern] = useState(new Date().getMonth()+1)
  const [yearIntern,setYearIntern] = useState(new Date().getFullYear())
  const [arrayDayOnMonth,setArrayDayOnMonth] = useState(takeArrayDayOnMonth(month,year))
  const [allowDayChoose,setAllowDayChoose] = useState([]);
  const [arrayDayChoose,setArrayDayChoose] = useState([]);

  const handleChangeTime = (value)=>{
     try{
        if(Number(monthIntern) === 1 && (Number(value) === -1)){
          setArrayDayOnMonth(takeArrayDayOnMonth(12,yearIntern-1));
          setMonthIntern(12);
          setYearIntern(yearIntern-1);
        }
        else if( Number(monthIntern) === 12 &&  (Number(value) === 1)){
          setArrayDayOnMonth(takeArrayDayOnMonth(1,yearIntern+1));
          setMonthIntern(1);
          setYearIntern(yearIntern+1);
        }
        else {
          setArrayDayOnMonth(takeArrayDayOnMonth(monthIntern+Number(value),yearIntern));
          setMonthIntern(monthIntern+Number(value));
        }
     }
     catch(e){
        console.log(e);
     }
  }
  
  const takeListDayAllow = (ele) =>{
      try{
          let result =[ele];
          for(let i=1; i<8; i++){
             let tempt1 = {};
             tempt1.month = ele.month;
             tempt1.year = ele.year;
             tempt1.day = ele.day -i;
             let tempt2 = {};
             tempt2.month = ele.month;
             tempt2.year = ele.year;
             tempt2.day = ele.day +i;
             result.push(tempt1);
             result.push(tempt2);
          }
          let countDayMonth = get_day_of_month(ele.month,ele.year);
          let finalResult = [];
          for(let i=0; i<result.length; i++){
             let obj ={};
             if( (result[i].day >0) && (result[i].day <=countDayMonth)){
                obj = result[i];
             }
             else if(result[i].day <=0){
                if(ele.month>1){ // giao tháng
                  obj.month = ele.month-1;
                  obj.year = ele.year;
                  obj.day = get_day_of_month(ele.month-1,ele.year) + result[i].day;
                }
                else{  // giao năm
                  obj.month = 12;
                  obj.year = ele.year-1;
                  obj.day = get_day_of_month(12,ele.year-1) + result[i].day;
                }
             }
             else if(result[i].day > countDayMonth){
                if(ele.month<12){ // giao tháng
                  obj.month = ele.month+1;
                  obj.year = ele.year;
                  obj.day = result[i].day - get_day_of_month(ele.month,ele.year);
                }
                else{  // giao năm
                  obj.month = 1;
                  obj.year = ele.year+1;
                  obj.day = result[i].day - 31;
                }
             }
             finalResult.push(obj);
          }
          return finalResult;
      }
      catch(e){
          console.log(e)
          return [ele]
      }
  }
  const ChooseDayToBookRoom = (value) =>{
    try{
        if(Number(arrayDayChoose.length) === 0){
            setArrayDayChoose(current => [...current, value]);
            setAllowDayChoose(takeListDayAllow(value));
        }
        else if(Number(arrayDayChoose.length) === 1){
            let array = []
            if(compareTwoDate(value,arrayDayChoose[0])){
                if(String(value.month) === String(arrayDayChoose[0].month) ){
                   for(let i=arrayDayChoose[0].day; i<=value.day; i++){
                      array.push({month:value.month,year:value.year,day:i})
                   }
                }
                else{
                   if(Number(value.year) === Number(arrayDayChoose[0].year)){
                          for(let i = arrayDayChoose[0].day; i<= get_day_of_month(arrayDayChoose[0].month,arrayDayChoose[0].year); i++){
                               array.push({month:arrayDayChoose[0].month,year:arrayDayChoose[0].year,day:i})
                          }
                          for(let i = 1; i<= value.day; i++){
                               array.push({month:value.month,year:value.year,day:i})
                          }
                   }
                   else{
                          for(let i = arrayDayChoose[0].day; i<= 31; i++){
                               array.push({month:12,year:arrayDayChoose[0].year,day:i})
                          }
                          for(let i = 1; i<= value.day; i++){
                                array.push({month:1,year:value.year,day:i})
                          }
                   }
                }
            }
            else{
                if(String(value.month) === String(arrayDayChoose[0].month) ){
                    for(let i=value.day; i<=arrayDayChoose[0].day; i++){
                      array.push({month:value.month,year:value.year,day:i})
                    }
                }
                else{
                    if(String(value.year) === String(arrayDayChoose[0].year)){
                          for(let i = value.day; i<= get_day_of_month(value.month,value.year); i++){
                                array.push({month:value.month,year:value.year,day:i})
                          }
                          for(let i = 1; i<= arrayDayChoose[0].day; i++){
                                array.push({month:arrayDayChoose[0].month,year:arrayDayChoose[0].year,day:i})
                          }
                    }
                    else{
                          for(let i = value.day; i<= 31; i++){
                                array.push({month:12,year:value.year,day:i})
                          }
                          for(let i = 1; i<= arrayDayChoose[0].day; i++){
                                array.push({month:1,year:arrayDayChoose[0].year,day:i})
                          }
                    }
                }
            }
            let array2 = array.filter( (ele) => Number(arrayDayUnAvailability.findIndex((e)=> String(e.day) === String(ele.day) && String(e.month) === String(ele.month) && String(e.year) === ele.year)) === -1)
            if(String(array2.length) !== String(array.length)){
              setArrayDayChoose([]);
              setAllowDayChoose([])
            }
            else{
              setArrayDayChoose(array2)
            }
        }
    }
    catch(e){
        console.log(e)
    }
  }

  const sendOrder = async () =>{
    try{
       if(arrayDayChoose.length >1){
           let array = arrayDayUnAvailability;
           for(let i=0; i<arrayDayChoose.length; i++){
              array.push(arrayDayChoose[i])
           }
           handleChangeDayUnAvailability(array); 
           let newOrder= {
              HotelId,
              HotelName,
              CategoryRoomId:CategoryRoomId, 
              CategoryRoomDesc:CategoryRoomDesc,
              RoomNumber:RoomNumber,
              IdRoomNumber:IdRoomNumber,
              UserOrderId:UserOrderId,
              DateOrder: new Date(),
              OwnerId,
              PhoneUserOrder:PhoneUserOrder, 
              NameUserOrder:NameUserOrder,
              EmailUserOrder:EmailUserOrder,
              ImgUserOrder:ImgUserOrder,
              PhoneContactExtra:PhoneContactExtra,
              LastDayServe:new Date(arrayDayChoose[arrayDayChoose.length-1].year, arrayDayChoose[arrayDayChoose.length-1].month-1, arrayDayChoose[arrayDayChoose.length-1].day, 0),
              FirstDayServe:new Date(arrayDayChoose[0].year, arrayDayChoose[0].month-1, arrayDayChoose[0].day, 0),
              Price:PricePerDay,
              Status:"Pending",
           }
           let newOrderSaved = await axios.post(`${url()}/orders/CreateOrder`,newOrder);
           if(newOrderSaved && newOrderSaved.data && newOrderSaved.data.data){
                dispatchredux({type: "ADDORDER", payload: { newOrder:newOrderSaved.data.data }});
                let newNotification = {
                    content:"Your Order is sent, please wait for response from hotel!",
                    userId:newOrderSaved.data.data.UserOrderId,
                    type:"OrderSuccess",
                    hotelId:newOrderSaved.data.data.HotelId,
                    roomId:newOrderSaved.data.data.CategoryRoomId,
                }
                let newNotificationSaved = await axios.post(`${url()}/notifications/CreateNotification`,newNotification);
                if(newNotificationSaved && newNotificationSaved.data && newNotificationSaved.data.data){
                    dispatchredux({type: "ADDNOTIFICATION", payload: { newNotification:newNotificationSaved.data.data }});
                };
                
                // lưu notification của bên người nhận thông báo 
                  let newSendNotification = {
                    content:"You have an new order!",
                    userId:OwnerId,
                    type:"ReceiveOrder",
                    hotelId:newOrderSaved.data.data.HotelId,
                    roomId:newOrderSaved.data.data.CategoryRoomId,
                  }
                  let newSendNotificationSaved = await axios.post(`${url()}/notifications/CreateNotification`,newSendNotification);
                  if(newSendNotificationSaved && newSendNotificationSaved.data && newSendNotificationSaved.data.data){
                      socket.emit("notification",OwnerId,newSendNotificationSaved.data.data,{IdOrder:newOrderSaved.data.data._id,Type:"NewOrder"})
                  };
           }
           setArrayDayChoose([]);
           setAllowDayChoose([]);
       }
    }
    catch(e){
       console.log(e)
    }
  }
  return (
    <div className="Canlerdal">
         <div className="Canlerdal_month_year">
            Tháng {monthIntern} Năm {yearIntern}
         </div>
         <div className="Canlerdal_month_year_choose">
             <div onClick={()=>handleChangeTime(-1)} className="previous">Previous</div>
             <div onClick={()=>handleChangeTime(1)} className="next">Next</div>
         </div>
         {
           (arrayDayOnMonth && arrayDayOnMonth.length && (arrayDayOnMonth.length>0)) && (
                <div className="Canlerdal_day_wrapper">
                      {
                          arrayDayOnMonth.map((item, index) => {
                              return (
                                 <div key={index}>
                                   {
                                      (arrayDayChoose.length <= 1) ? (
                                        <>
                                            {
                                                ( Number(allowDayChoose.length) === 0) ? (
                                                  <>
                                                      { 
                                                            (
                                                              compareTwoDate({day:item,month:monthIntern,year:yearIntern},today)
                                                              && arrayDayUnAvailability 
                                                              &&( Number(arrayDayUnAvailability.findIndex((e)=> String(e.day) === String(item) && String(e.month) === String(monthIntern) && String(e.year) === String(yearIntern))) === -1) 
                                                            )  ? (
                                                                  <div onClick={()=>ChooseDayToBookRoom({day:item,month:monthIntern,year:yearIntern})} style={{backgroundColor:"rgba(46, 98, 244, 0.2)"}} className="Canlerdal_day_ele">
                                                                      {item}
                                                                  </div>
                                                              ) :(
                                                                  <div className="Canlerdal_day_ele">
                                                                      {item}
                                                                  </div>
                                                              )
                                                      }
                                                  </>
                                                ) :(
                                                  <>
                                                      { 
                                                              (
                                                                ( Number(allowDayChoose.findIndex((e)=> String(e.day) === String(item) && String(e.month) === String(monthIntern) && String(e.year) === String(yearIntern))) !== -1) 
                                                                && compareTwoDate({day:item,month:monthIntern,year:yearIntern},today)
                                                                && arrayDayUnAvailability 
                                                                &&( Number(arrayDayUnAvailability.findIndex((e)=> String(e.day) === String(item) && String(e.month) === String(monthIntern) && String(e.year) === yearIntern)) === -1)
                                                              )  ? (
                                                                  <div onClick={()=>ChooseDayToBookRoom({day:item,month:monthIntern,year:yearIntern})} style={{backgroundColor:"rgba(46, 98, 244, 0.2)"}} className="Canlerdal_day_ele">
                                                                      {item}
                                                                  </div>
                                                              ) :(
                                                                  <div className="Canlerdal_day_ele">
                                                                      {item}
                                                                  </div>
                                                              )
                                                      }
                                                  </>
                                                )
                                            }
                                        </>
                                   
                                      ):(
                                        <>
                                            { 
                                                    (
                                                      (Number(arrayDayChoose.findIndex((e)=> String(e.day) === String(item) && String(e.month) === String(monthIntern) && String(e.year) === String(yearIntern))) !== -1)
                                                      && arrayDayUnAvailability 
                                                      &&(Number(arrayDayUnAvailability.findIndex((e)=> String(e.day) === String(item) && String(e.month) === String(monthIntern) && String(e.year) === String(yearIntern))) === -1)
                                                    )  ? (
                                                        <div onClick={()=>{setAllowDayChoose([]);setArrayDayChoose([])}} 
                                                             style={{backgroundColor:"rgba(255, 71, 67, 0.7)"}} 
                                                             className="Canlerdal_day_ele">
                                                            {item}
                                                        </div>
                                                    ) :(
                                                        <div 
                                                            onClick={()=>{setAllowDayChoose([]);setArrayDayChoose([])}} 
                                                            className="Canlerdal_day_ele">
                                                            {item}
                                                        </div>
                                                    )
                                            }
                                          </>
                                      )
                                   }
                                  
                                 </div>
                              )
                          })
                      }
                </div>
           )
         }
         {
            (arrayDayChoose.length >1) && (
              <div onClick={()=>sendOrder()} className="sendOrder_btn">
                  Send Order
              </div>
            )
         }
    </div>
  );
};

export default Canlerdal;
