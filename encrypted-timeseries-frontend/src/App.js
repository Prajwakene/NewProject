import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

const serverEndpoint = 'http://localhost:3001'; // Change this to your backend endpoint

function App() {
  const [data, setData] = useState([]);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(serverEndpoint);

    socket.on('data', (encryptedData) => {
      // Decrypt and validate data here, then save it to MongoDB
      // Update successRate accordingly
      // You may want to use Axios to send data to your backend
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
      <div>
        {/* Display data here */}
      </div>
    </div>
  );
}

export default App;
