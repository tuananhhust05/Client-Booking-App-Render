import {createStore} from 'redux'
import SearchReducerRedux from './reducer'
import { composeWithDevTools } from 'redux-devtools-extension';
const composedEnhancers = composeWithDevTools(); 
const store = createStore(SearchReducerRedux,composedEnhancers);// enhancer là tham só thữ 2
export default store; 