import React from "react";
import * as ReactDOMClient from 'react-dom/client';
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
//redux 
import store from './redux/store'
import {Provider} from 'react-redux'

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
<Provider store={store}>
  <React.StrictMode>
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
  </React.StrictMode>
</Provider>
);