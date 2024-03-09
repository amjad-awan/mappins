import { Room, Cancel } from "@material-ui/icons";
import React, { useRef, useState } from "react";
import "./register.css";
import axios from "axios";
const Register = ({setShowRegister}) => {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/register",
        newUser
      );
      console.log(res.data);
      setSuccess(true);
      setFailure(false);
    } catch (err) {
      setFailure(true);
      setSuccess(false);
    }
  }
  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        AmjadPin
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" placeholder="enter user name" ref={nameRef} />
        <input type="email" placeholder="enter email" ref={emailRef} />
        <input type="password" placeholder="enter password" ref={passwordRef} />
        <button className="registerBtn">Register</button>
        {success && (
          <span className="success">Successfull. you can login now!</span>
        )}
        {failure && <span className="failure">Something went wrong!</span>}
        <Cancel className="registerCancel" onClick={()=>setShowRegister(false)} />
      </form>
    </div>
  );
};

export default Register;
