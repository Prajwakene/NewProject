import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

const serverEndpoint = "http://localhost:3001"; // Change this to your backend endpoint


// Function to decrypt a message
function decryptMessage(encryptedMessage, secretKey) {
  // Implement decryption logic here
}

// Function to validate data
function validateData(secretKey) {
  // Implement data validation logic here
}


// Function to render data
const renderData = (data) => {
  if (data.length === 0) {
    return <p>No data available.</p>;
  }

  return data.map((item, index) => (
    <div key={index}>
      <p>Name: {item.name}</p>
      <p>Origin: {item.origin}</p>
      <p>Destination: {item.destination}</p>
      <hr />
    </div>
  ));
};
function App() {
  const [data, setData] = useState([]);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(serverEndpoint);

    socket.on("data", async (encryptedData) => {
      try {
        // Decrypt the data
        const decryptedData = decryptMessage(encryptedData, "7f371d3b93863e513087c19a353db55ce9fabb43d34a895e3783afaef6662b15"); // Replace with your secret key

        // Parse the decrypted JSON
        const payload = JSON.parse(decryptedData);

        // Validate data here using the secret_key
        const isValid = validateData(payload.secret_key);

        if (isValid) {
          // Save data to MongoDB using Axios or fetch
          await axios.post("http://localhost:3001/save-data", payload);

          // Update success rate
          setSuccessRate((prevSuccessRate) => prevSuccessRate + 1);
        } else {
          // Data validation failed, handle it as needed
          console.error("Data validation failed:", payload);
        }
      } catch (error) {
        // Handle decryption errors
        console.error("Error decrypting or processing data:", error);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Encrypted Timeseries Data</h1>
      <div>
        <p>Success Rate: {successRate}%</p>
      </div>
      <div>{renderData()}</div>
    </div>
  );
}

export default App;
