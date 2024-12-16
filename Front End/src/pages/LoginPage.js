import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, TextField, Box, CardContent, CardHeader } from "@mui/material";

import axios from "axios";


export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [msg,setmsg]=useState("");

  const handleLogin = (event) => {

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    async function verify(params) {
        try {
            const response = await axios.post("http://localhost:8080/ServletAPI/api/login", params);

            const data = response.data;

            console.log(data);

            setmsg("pass");
            if(email==="billavikas.reddy@gmail.com"){
              setmsg("manager");
            }
            if(email==="vnomula@hawk.iit.edu"){
              setmsg("salesperson");
            }
            localStorage.setItem("email", email);
            localStorage.setItem("userId",data.user_id);
            localStorage.setItem("uname",data.name);
            
        } catch (err) {
          if(err.status===401){
            setmsg("fail");
          }
          else{
            window.alert("please try again later");
          }
        }
    }

    verify(params);
};

  React.useEffect(() => {
    if (msg === "fail") {
      console.log(msg);
      document.getElementById("message").style.visibility = "visible";
    }
    else if(msg==="manager"){
      navigate("/manager");
    }
    else if(msg==="salesperson"){
      navigate("/EditOrder")
    }
    else if (msg === "pass") {
      console.log(msg);
      navigate("/Home");
    }
  }, [msg]);
  const handleCreateAccount = () => {
    navigate("/SignUp");
  };
  return (
    <CardContent component="form">
      <CardHeader title="Login" style={{ color: "#7267CB", fontSize: 18 }} />
      <Box>
        <AccountCircleIcon style={{ fontSize: 150 }} />
      </Box>

      <TextField
        className="field"
        type="text"
        label="Email"
        name="email"
        value={email}
        onChange={(e) => {
          setemail(e.target.value);
        }}
        Icon={<AccountCircleIcon />}
        margin="dense"
        required
      />

      <TextField
        className="field"
        type="password"
        label="Password"
        name="password"
        value={password}
        onChange={(e) => {
          setpassword(e.target.value);
        }}
        margin="dense"
        required
      />


      <h3 id="message" style={{ visibility: "hidden", color: "RED",height:"30px"}}>
        Email or Password is incorrect!!
      </h3>

      <Button onClick={handleLogin} color="primary" variant="contained">
        Login
      </Button>
        <br></br>
        <br></br>
      <Button variant="contained" color="primary" onClick={handleCreateAccount}>
        create account
      </Button>
    </CardContent>
  );
}
