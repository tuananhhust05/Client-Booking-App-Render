import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch";
import {url} from '../../config.js'
const FeaturedProperties = () => {
  // lấy ra danh sách khách sạn theo đặc điểm và có giới hạn số lượng 
  const { data, loading, error } = useFetch(`${url()}/hotels?featured=true&limit=4`);
  return (
    <div className="fp">
      {loading ? (
        "Loading"
      ) : (
        <>
          {data.map((item) => (
            <div className="fpItem" key={item._id}>
              <img
                src={item.photos[0]}
                alt=""
                className="fpImg"
              />
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
              {item.rating && <div className="fpRating">
                <button>{item.rating}</button>
                <span>Excellent</span>
              </div>}
            </div>
          ))}
        </>
      )}
    </div>
    // <div className="fp">
    //   <div className="fpItem">
    //     <img
    //       src="https://cf.bstatic.com/xdata/images/hotel/square600/13125860.webp?k=e148feeb802ac3d28d1391dad9e4cf1e12d9231f897d0b53ca067bde8a9d3355&o=&s=1"
    //       alt=""
    //       className="fpImg"
    //     />
    //     <span className="fpName">Aparthotel Stare Miasto</span>
    //     <span className="fpCity">Madrid</span>
    //     <span className="fpPrice">Starting from $120</span>
    //     <div className="fpRating">
    //       <button>8.9</button>
    //       <span>Excellent</span>
    //     </div>
    //   </div>
    //   <div className="fpItem">
    //     <img
    //       src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/215955381.jpg?k=ff739d1d9e0c8e233f78ee3ced82743ef0355e925df8db7135d83b55a00ca07a&o=&hp=1"
    //       alt=""
    //       className="fpImg"
    //     />
    //     <span className="fpName">Comfort Suites Airport</span>
    //     <span className="fpCity">Austin</span>
    //     <span className="fpPrice">Starting from $140</span>
    //     <div className="fpRating">
    //       <button>9.3</button>
    //       <span>Exceptional</span>
    //     </div>
    //   </div>
    //   <div className="fpItem">
    //     <img
    //       src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/232902339.jpg?k=3947def526b8af0429568b44f9716e79667d640842c48de5e66fd2a8b776accd&o=&hp=1"
    //       alt=""
    //       className="fpImg"
    //     />
    //     <span className="fpName">Four Seasons Hotel</span>
    //     <span className="fpCity">Lisbon</span>
    //     <span className="fpPrice">Starting from $99</span>
    //     <div className="fpRating">
    //       <button>8.8</button>
    //       <span>Excellent</span>
    //     </div>
    //   </div>
    //   <div className="fpItem">
    //     <img
    //       src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/322658536.jpg?k=3fffe63a365fd0ccdc59210188e55188cdb7448b9ec1ddb71b0843172138ec07&o=&hp=1"
    //       alt=""
    //       className="fpImg"
    //     />
    //     <span className="fpName">Hilton Garden Inn</span>
    //     <span className="fpCity">Berlin</span>
    //     <span className="fpPrice">Starting from $105</span>
    //     <div className="fpRating">
    //       <button>8.9</button>
    //       <span>Excellent</span>
    //     </div>
    //   </div>
    // </div>
  );
};

export default FeaturedProperties;
