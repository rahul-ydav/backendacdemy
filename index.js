const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/login', (req, res)=>{
    console.log(req.body);
    let message = 'Invalid credentials';
    if(req.body.email==='abc@gmail.com' && req.body.password==='abc'){
        message = 'FrontPage';
    }
    res.send({message});
})

app.listen(8000, ()=>{
    console.log(`Listening on port 8000`);
})