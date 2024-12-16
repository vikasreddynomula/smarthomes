import { Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { OpenAI } from "openai";
import Header from "./Header";
const openai = new OpenAI({ apiKey: "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",dangerouslyAllowBrowser: true });


function CustomerService() {
  const [option, setOption] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [issue, setIssue] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketData, setTicketData] = useState(null);
  
  const [file, setFile] = useState(null);


  const OpenTicket = () => {
    setOption("openTicket");
  };


  const checkStatus = () => {
    setOption("checkStatus");
  };


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const encodeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  function generateUniqueNumber() {
    return Date.now() + Math.floor(Math.random() * 1000); 
  }

  const handleFetch = async () =>{

    try {
      const response = await axios.get("http://localhost:8080/ServletAPI/api/addTicket", {
          params: { ticketNumber: ticketNumber }
      });
      console.log(response.data);
      setTicketData(response.data);


  } catch (error) {
      console.error("Error fetching ticket:", error);
      alert("Error fetching ticket details.");
  }

    

  }
  const handleSubmit = async () => {
    if (!file || !orderNumber || !issue) {
      alert("Please fill in all fields and upload an image.");
      return;
    }
    setTicketData(null);
    const uniqueNumber = generateUniqueNumber();

    alert(`Here is your ticket ID you can also view this in check Ticket Status section: ${uniqueNumber}`);

    try {

      const base64Image = await encodeImage(file);


      const prompt = `${issue}. Based on the image provided:
- If only the shipment box is damaged but the product is unharmed, respond with "2.replace."
- If the product inside is heavily damaged, respond with "1.refund."
- If the product appears in perfect condition, respond with "3.escalate to human agent."
Only respond with "1.refund," "2.replace," or "3.escalate to human agent."`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [
          { role: "user", content: prompt },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: base64Image },
              },
            ],
          },
        ],
      });

      
      const decision = response.choices[0].message.content;
      const result = decision.charAt(0) === "1" ? "Refund Order" : (decision.charAt(0) === "2" ? "Replace Order" : "Escalate to Human Agent");


      console.log(result);
      console.log("Decision:", generateUniqueNumber());

      console.log(JSON.stringify({
        ticketNumber: uniqueNumber,
        orderNumber: orderNumber,
        issue: issue,
        decision: result,
        email:localStorage.getItem("email"),
        fileName:file.name
      }));
    await axios.post("http://localhost:8080/ServletAPI/api/addTicket", {
    ticketNumber: uniqueNumber,
    orderNumber: orderNumber,
    issue: issue,
    decision: result,
    email: localStorage.getItem("email"),
    fileName:file.name
  });

  console.log('Ticket created successfully:', response.data);
  } 
     catch (error) {
      console.error("Error submitting ticket:", error);
      alert("There was an error processing your request.");
    }
    setFile(null);
    setIssue(null);
    setOrderNumber(null);
  };

  return (
    <div>
      <Header></Header>

    <div style={{ textAlign: "center", justifyContent: "center", margin: "100px" }}>
      <Button style={{ marginBottom: "20px" }} color="primary" variant="contained" onClick={OpenTicket}>
        Open a Ticket
      </Button>
      <br />
      <Button color="primary" variant="contained" onClick={checkStatus} style={{ marginBottom: "20px"}}>
      Status of a Ticket
      </Button>

      {option === "openTicket" && (
        <div style={{ border: "3px solid black", padding: "20px", margin: "20px auto", width: "450px" }}>
          <div style={{ margin: "50px" }}>
            <TextField
              className="field"
              type="text"
              label="Order Number"
              name="OrderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              style={{ width: "336px", marginBottom: "20px" }}
            />
            <br />
            <TextField
              className="field"
              type="text"
              label="Tell us briefly about your problem"
              name="Issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              style={{ width: "336px", marginBottom: "20px" }}
            />
            <br />
            <TextField
              className="fields"
              type="file"
              name="orderImage"
              onChange={handleFileChange}
              style={{ marginBottom: "20px" }}
            />
            <br />
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      )}

      {option === "checkStatus" && (
        <div style={{ border: "3px solid black", padding: "20px", margin: "20px auto", width: "400px" }}>
          <div style={{ margin: "50px" }}>
            <TextField
              className="field"
              type="text"
              label="Ticket Number"
              value={ticketNumber}
              onChange={(e)=> setTicketNumber(e.target.value)}
              name="ticketNumber"
              style={{ width: "300px" }}
            />
            <br />
            <Button color="primary" variant="contained" onClick={handleFetch} style={{marginTop:"20px" }}>
              Fetch Details
            </Button>

            {ticketData && (
            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "lightblue", borderRadius: "8px", textAlign: "left" }}>
            <h3 style={{ textAlign: "center", margin: "10px 0", color: "#333" }}>Ticket Details</h3>
            <p style={{ fontSize: "14px", margin: "8px 0" }}>
              <strong>Ticket Number:</strong> {ticketData.ticketNumber}
            </p>
            <p style={{ fontSize: "14px", margin: "8px 0" }}>
              <strong>Order Number:</strong> {ticketData.orderNumber}
            </p>
            <p style={{ fontSize: "14px", margin: "8px 0" }}>
              <strong>Issue:</strong> {ticketData.issue}
            </p>
            <p style={{ fontSize: "14px", margin: "8px 0" }}>
              <strong>Decision:</strong> {ticketData.decision}
            </p>
            <p style={{ fontSize: "14px", margin: "8px 0" }}>
              <strong>Email:</strong> {ticketData.email}
            </p>
            <img src={`Images_for_customer_service/${ticketData.fileName}`} alt="Uploaded Issue" style={{ maxWidth: "50%",maxHeight:"50%", borderRadius: "8px" }} />
          </div>
          )}
            
          </div>
        </div>
      )}

      
    </div>
    </div>
  );
}

export default CustomerService;
