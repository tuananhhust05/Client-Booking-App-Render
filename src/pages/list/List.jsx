import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
//import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import {url} from '../../config.js'
// redux 
import{SearchDataSelector} from '../../redux/selector' // mỗi lần dịch là thay đổi folder cha hiện tại 
import {useSelector} from 'react-redux' 

// components tìm kiếm khách sạn 
const List = () => {
  // lấy dữ liệu từ redux 
  const searchData =useSelector(SearchDataSelector);
  //console.log("Dữ liệu trong store redux",searchData)

  // truyền dữ liệu qua state location 
  //const location = useLocation(); // sử dụng useLocation để lấy dữ liệu từ react router
  //const [destination, setDestination] = useState(location.state.destination); 
  const [destination, setDestination] = useState(searchData.destination);
  const [options, setOptions] = useState(searchData.options);
  const [date, setDate] = useState(searchData.date);
  const [openDate, setOpenDate] = useState(false);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  
  //bản chất bên trong là react hook, khi đầu vào url thay đổi thì hàm bên trong useFetch chạy lại => lấy lại dữ liệu 
  const { data, loading, error, reFetch } = useFetch(
    `${url()}/hotels?city=${destination}&min=${min || 0 }&max=${max || 999}`
  );
  const handleClick = () => {
    console.log("Tìm kiếm")
    reFetch(); // call lại api sau khi thay đổi dữ liệu tìm kiếm 
  };
  // component list search hiển thị lại thông tin từ trang chủ => truyền qua location 
  // cài thêm 1 số hàm đê có thẻ set lại nếu cần 
  // việc thay đổi state ở đây không ảnh hưởng gì đến state ở page trc 
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              {/* lấy ra dữ liệu thay đổi onChange */}
              <input id="" onChange={(item) => setDestination(item.target.value)} placeholder={destination} type="text" />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            {loading?"loading":<>
              {data.map(item=>(  // truyền vào dữ liệu bằng prop 
                <SearchItem item={item} key={item._id}/>
              ))}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
