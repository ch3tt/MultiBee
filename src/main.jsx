import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import "./index.css";
import "./App.css";

import Home, { isDarkAtom } from "./pages/Home";
import openSocket from "socket.io-client";
import Header from "./components/Header";
import { ConfigProvider } from "antd";
import Search from "antd/es/transfer/search";
import Searching from "./pages/Searching";
import { useAtom } from "jotai";
import { getCookie } from "./Helper";
import socketIO  from "socket.io-client";

export const socket =  socketIO.connect(import.meta.env["VITE_REACT_APP_SOCKET"], {
  autoConnect: true,
  reconnection: true,
  path: "/api/socket.io/",
  transports: ["polling"],
  auth: {
    token: getCookie("authToken"),
  },
  secure: true
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <ErrorBoundary />,
  }
]);
function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Error!</div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(
 
  
   <ConfigProvider theme={{
token: {
  colorFillSecondary: '#f6f7f8',
  colorBgContainer: '#f6f7f8'
}
   }}>
    <Home/>
    </ConfigProvider>
  

);