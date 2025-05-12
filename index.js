require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/login', (req, res)=>{
    const {email, password} = req.body;

    if(!req.body.email==='abc@gmail.com' || !req.body.password==='abc'){
        res.sendStatus(401);
        return;
    }
    const accessToken = jwt.sign({email, password}, process.env.ACCESS_TOKEN_SECRET);
    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24*60*60*1000 // 1 day
    });
    res.sendStatus(200);
})

app.post('/verifyAuth', authenticateToken, (req, res)=>{
    res.sendStatus(200);
})

app.post('/logout', (req, res)=>{
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'strict',
        secure: true
    });
    res.sendStatus(200);
});


function authenticateToken(req, res, next){
    const token = req.cookies.jwt;
    if(!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
        if(err) return res.sendStatus(403);
        req.user = decoded;
        decoded.password = 'abc';
        next();
    })
}

app.listen(8000, ()=>{
    console.log(`Listening on port 8000`);
})