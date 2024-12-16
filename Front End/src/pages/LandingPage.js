import React from "react";
import "./LandingPage.css";
import LoginPage from "./LoginPage";
import {
  Container,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

export default function LandingPage() {
  return (
    <Container maxWidth={false}>
      <Box margin={1} className="brand">
        <b>SmartHomes</b>
      </Box>
      <Container>
        <Grid2 container direction="row" spacing={2}>
          <Grid2 xs={8}>
            <Card elevation={3}>
              <CardContent>
                <img className="landing-img"
                  src="https://i0.wp.com/www.mcnaircustomhomes.com/wp-content/uploads/2023/06/luxury-smart-home.jpg?w=2000&ssl=1"
                  style={{ width: "100%", height: "auto" }}
                  alt="Books"
                />
              </CardContent>
            </Card>
          </Grid2>


          <Grid2 xs={4}>
            <Card elevation={3}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                lineHeight={2}
                p={2}
              >
                <LoginPage />
              </Box>
            </Card>
          </Grid2>
        </Grid2>
      </Container>
    </Container>
  );
}
