const express=require("express");
const path=require("path");
const mainRouter = require('./routes/index.js');
const cookieParser = require("cookie-parser");

const app=express();

app.use(cookieParser());
require("dotenv").config()

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/hostelManagementApplication');
const DB = process.env.DATABASE_URL
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("database Connected")
    
}).catch((err)=>{
    console.log("database not connected");
})

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const passport = require("passport");
const cookieSession = require("cookie-session");
app.use(cookieSession({
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(mainRouter);

app.listen(3000,()=>{
    console.log("running on port 3000");
})
