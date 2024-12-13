import React from "react";
import "./index.css"
import SigninWithGoogle from "../SigninWithGoogle";

const LoginPage = () => {

  return (
    <div className="login-container">
      <div className="login-card">
        <img src = "https://res.cloudinary.com/ddw4ubmbj/image/upload/v1734055813/Group_1171276168_awq9pl.svg" alt = "logo"/>
        <div>
        <SigninWithGoogle/>
        </div>
        
      </div>
      
    </div>
  );
};

export default LoginPage;
