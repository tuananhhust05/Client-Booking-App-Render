import {createSelector} from 'reselect'
// redux có thể lưu trữ dữ liệu cho các bên khác truy cập lấy ra và làm dữ liệu tìm kiếm 
// redux có thể là nơi vừa lưu trữ dữ liệu để tìm kiếm và điều kiện tìm kiếm => đây là xu hướng để giảm thiểu việc call api 


// các selector 
export const SearchData =(state) => state

export const SearchDataSelector = createSelector(
    SearchData,
    (data) => {   // dữ liệu đầu vào lấy từ store 
      // trả ra 1 mảng 
      return data  // dữ liệu trả về 
    }
  );