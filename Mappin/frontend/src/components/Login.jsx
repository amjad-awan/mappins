import { Room, Cancel } from "@material-ui/icons";
import React, { useRef, useState } from "react";


import "./login.css";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {

  const [failure, setFailure] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();
  const handleSubmit = async (e) => {
	
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/login",
        user
      )
      myStorage.setItem("user", res.data.username);
					
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setFailure(false);
    } catch (err) {
      setFailure(true);
    }
  };
  return (
    <div className="LoginContainer">
      <div className="login-logo">
        <Room />
        AmjadPin
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" placeholder="enter user name" ref={nameRef} />
        <input type="password" placeholder="enter password" ref={passwordRef} />
        <button className="loginBtn">Login</button>

        {failure && <span className="failure">Something went wrong!</span>}
        <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
      </form>
    </div>
  );
};

export default Login;
