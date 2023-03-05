import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useState } from "react";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import {url} from '../../config.js'
import{SearchDataSelector} from '../../redux/selector' 
import {useSelector} from 'react-redux' 

const List = () => {
  const searchData =useSelector(SearchDataSelector);
  const [destination, setDestination] = useState(searchData.destination);
  const [cheapestPrice, setCheapestPrice] = useState(200);
  const [hotelName, setHotelName] = useState('');
  const { data, loading, reFetch } = useFetch(
    `${url()}/hotels?city=${destination}&hotelName=${hotelName}&cheapestPrice=${cheapestPrice}`
  ); 
  const handleClick = () => {
    reFetch(); 
  };
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
              <input onChange={(item) => setDestination(item.target.value)} placeholder={destination} type="text" value={destination} />
            </div>
            <div className="lsItem">
              <label>Hotel Name</label>
              <input onChange={(item) => setHotelName(item.target.value)} placeholder="type hotel name" type="text" value={hotelName} />
            </div>
            <div className="lsItem">
              <label>Cheapest Price</label>
              <input onChange={(item) => setCheapestPrice(item.target.value)}  type="number" value={cheapestPrice} />
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
