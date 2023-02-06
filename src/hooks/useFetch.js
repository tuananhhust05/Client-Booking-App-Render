import { useEffect, useState } from "react";
import axios from "axios";
// hàm chuyên dùng call api 
const useFetch = (url) => {
  const [data, setData] = useState([]);// dữ liệu trả về trả vào đây 
  const [loading, setLoading] = useState(false);//trạng thái load dữ liệu 
  const [error, setError] = useState(false);// biến lưu trữ lỗi nêú có 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url);
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false); // set lại trạng thái load dữ liệu 
    };
    fetchData();
  }, [url]);// chạy lần đầu cho tới khi url thay đổi 

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };// trả ra cả hàm refetch để lấy lại dữ liệu nếu cần. 
};

export default useFetch;