import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
//import { SearchContext } from "../../context/SearchContext";
import {useSelector} from 'react-redux'
import{SearchDataSelector} from '../../redux/selector' // mỗi lần dịch là thay đổi folder cha hiện tại 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {url} from '../../config.js'
const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data} = useFetch(`${url()}/hotels/room/${hotelId}`); // dữ liệu về các phòng cửa 1 khách sạn 
  // console.log(data);
  const { date } = useSelector(SearchDataSelector); // lấy dữ liệu từ context 
  
  // trả ra 1 mảng gồm các ngày đơn lẻ từ ngày bắt đầu đến ngày kết thúc dựa vào dữ liệu mà user chọn
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];
    while (date <= end) {// vòng lặp 
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };
  const alldates = getDatesInRange(date[0].startDate, date[0].endDate); // lấy ra danh sách các ngày thuê phòng 
  // trả ra giá trị true hoặc false 
  // nếu những ngày mà user chọn có 1 ngày nằm trong những ngày không khả dụng thì trả về false
  const isAvailable = (roomNumber) => {
    // hàm some trả về false nếu cả mảng không true, trả về true nếu có 1 đối tượng true 
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;  //giá trị true hoặc false 
    const value = e.target.value;  // lấy ra giá trị value 
    setSelectedRooms(
      checked // nếu giá trị bằng true thì thêm vào mảng giá trị 
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)  // nếu bằng false thì không thêm.
    );
  };

  const navigate = useNavigate();
  
  // check luôn trong giá trị true false của phím input 
  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          // phím update những ngày khả dụng của 1 phòng 
          // khi user chọn thuê 1 căn phòng trong 1 khoảng thời gian thì chúng ta cần 
          // update dữ liệu về những ngày đã thuê vào 
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );
      // function này lấy từ component cha
      setOpen(false); // order xong thì đóng form và trở về trang chủ. 
      navigate("/");
    } catch (err) {}
  };
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => ( // map ra danh sách phòng 
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  {/*hiện mã phòng*/}
                  <label>{roomNumber.number}</label> 
                  <input
                    type="checkbox" // kiểu dữ liệu dạng checkbox
                    value={roomNumber._id}
                    onChange={handleSelect}
                    // không chọn những giá trị disableed
                    // disabled input 
                    disabled={!isAvailable(roomNumber)} // nếu phòng đó không available thì phòng đó không được chọn.
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;