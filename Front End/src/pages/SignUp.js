import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import axios from "axios";

export default function SignUp() {
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [address, setaddress] = useState("");
  const [mobile, setmobile] = useState();
  const [password, setPassword] = useState("");
  const [confirm_password, setcomfirm_Password] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {

    const data = {
      email: email,
      name: fullname,  
      fullAddress: address,  
      phoneNumber: mobile,   
      password: password
    };
  
    if (password === confirm_password && password.length > 0) {
      axios
        .post("http://localhost:8080/ServletAPI/api/signup", JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json" // Sending as JSON
          }
        })
        .then((res) => console.log(res.data))
        .catch((err) => {
          console.log("error" + err);
        });
  
      navigate("/");
    } else if (password.length > 0) {
      window.alert("password and confirm password doesnt match");
    }
  };
  
  return (
    <Container maxWidth={false}>
      <Box margin={1} className="brand">
        <b>SmartHomes</b>
      </Box>

      <Container>
        <Grid container direction="row">
          <Grid container item xs={8}>
            <Card elevation={3}>
              <CardContent>
                <img
                  src="https://i0.wp.com/www.mcnaircustomhomes.com/wp-content/uploads/2023/06/luxury-smart-home.jpg?w=2000&ssl=1"
                  style={{ width: "100%", height: "auto" }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid container item xs={4}>
            <Card container component="form" elevation={3}>
              <Box
                container
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                width="100%"
                height="auto"
              >
                <CardContent component="form">
                  <CardHeader
                    title="Create Account"
                    style={{ color: "#7267CB", fontSize: "9px" }}
                  />

                  <TextField
                    className="field"
                    type="text"
                    label="Full Name"
                    name="fullname"
                    required
                    onChange={(e) => {
                      setfullname(e.target.value);
                    }}
                    value={fullname}
                    margin="dense"
                  />

                  <TextField
                    type="email"
                    className="field"
                    label="Email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                    margin="dense"
                    required
                  />
                  <TextField
                    type="text"
                    className="field"
                    label="mobile number"
                    onChange={(e) => {
                      setmobile(e.target.value);
                    }}
                    name="mobile"
                    value={mobile}
                    margin="dense"
                    required
                  />
                  <TextField
                    type="text"
                    className="field"
                    label="Full Address"
                    name="address"
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    margin="dense"
                    required
                  />

                  <TextField
                    type="password"
                    className=" field"
                    label="Password"
                    name="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    value={password}
                    margin="dense"
                    required
                  />
                  <TextField
                    type="password"
                    className=" field"
                    label="Confirm Password"
                    name="confirm_password"
                    value={confirm_password}
                    onChange={(e) => {
                      setcomfirm_Password(e.target.value);
                    }}
                    margin="dense"
                    required
                  />
                  <p></p>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSignUp}
                  >
                    Create Account
                  </Button>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}
