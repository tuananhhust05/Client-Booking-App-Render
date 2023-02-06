import { createContext, useEffect, useReducer } from "react";

// sử dụng mô hinhg useContext và useReducer để quản lý global state => quy mô dự án nhỏ, ít khi phải thay đổi global state 
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,// xử lý json ở localStorage 
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

// hàm xử lý các action sau đó trả dữ liệu về context 
const AuthReducer = (state, action) => {
  switch (action.type) {

    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      // dưới đây là dữ liệu trả về global state 
      return {
        user: null,
        loading: false,
        error: action.payload, // trả về lỗi 
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  //INITIAL_STATE: giá trị khởi tạo cho state 
  // dispatch đẩy lên action để thay đổi giá trị của state 
  // thay đổi state là re-render lại cả component 
  // state mạc định là global state có nhiệm vụ lưu trữ dữ liệu reducer trả về 
  // state và dispatch sinh ra từ useReducer lại được gắn với context 
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    // dùng auth context để chứa dữ liệu state 
    <AuthContext.Provider
      value={{  // những giá trị lưu trong context 
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};