import { toast as notify, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from "react";

const ToastComponent = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};

export default ToastComponent;
