const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static('ev2'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const db = mongoose.connections;

mongoose.connect("mongodb://127.0.0.1:27017/Server", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const schema = new mongoose.Schema({
    name:String,
    dob:String,
    session: String,
    phoneNumber: Number,
    email: String,
    password: String
});

const data = mongoose.model('Data2',schema);
var DATA = '';

app.post('/send',async(req,res)=>{
    const WebsiteData = {
        name:req.body.name,
        dob:req.body.dob,
        session: req.body.session,
        phoneNumber: req.body.phone,
        email: req.body.email,
        password: req.body.password
    }
    
    DATA = new data(WebsiteData);
    output = await DATA.save();

    console.log("Data Inserted Successfully");
    res.send("");
});

app.listen('3000');