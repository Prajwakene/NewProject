// import all the requires packages whatever is necessary 
//1
const express = require('express');
//2
const app = express();
//3
const port = 8000;


//4 start the server so that we can listen req and response 
app.listen(process.env.PORT, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
