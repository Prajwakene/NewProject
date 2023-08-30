import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

const serverEndpoint = "http://localhost:3001"; // Change this to your backend endpoint

// Function to decrypt a message using AES-256-CTR
function decryptMessage(encryptedMessage, secretKey) {
  try {
    // Convert the hexadecimal string to a Buffer
    const encryptedBuffer = Buffer.from(encryptedMessage, "hex");

    // Extract the IV (first 16 bytes) from the encrypted message
    const iv = encryptedBuffer.slice(0, 16);

    // Create a decipher with AES-256-CTR
    const decipher = crypto.createDecipheriv(
      "aes-256-ctr",
      Buffer.from(secretKey),
      iv
    );

    // Decrypt the message
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer.slice(16)),
      decipher.final(),
    ]);

    // Convert the decrypted Buffer to a string (assuming the original message was a string)
    const decryptedMessage = decryptedBuffer.toString("utf-8");

    return decryptedMessage;
  } catch (error) {
    console.error("Error decrypting message:", error);
    return null; // Return null in case of decryption failure
  }
}

// Function to validate data using the secret key
function validateData(payload, secretKey) {
  try {
    // Calculate the expected secret_key from the payload
    const expectedSecretKey = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          name: payload.name,
          origin: payload.origin,
          destination: payload.destination,
        })
      )
      .digest("hex");

    // Compare the expectedSecretKey with the provided secretKey
    return expectedSecretKey === secretKey;
  } catch (error) {
    console.error("Error validating data:", error);
    return false; // Return false in case of validation failure
  }
}

// Function to render data
const renderData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
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
  const [data] = useState([]);

  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(serverEndpoint);

    socket.on("data", async (encryptedData) => {
      try {
        // Decrypt the data
        const decryptedData = decryptMessage(
          encryptedData,
          "7f371d3b93863e513087c19a353db55ce9fabb43d34a895e3783afaef6662b15"
        ); // Replace with your secret key

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
      <div>{renderData(data)}</div>
    </div>
  );
}

export default App;
