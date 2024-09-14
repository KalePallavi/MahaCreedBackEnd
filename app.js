
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');


 app.use(express.static('public'));
 app.use(cors());
 app.use(express.json());


const url = process.env.MONGO_URL;

//  const MONGO_URL = "mongodb://localhost/MahaCrred ";

 main().then(()=>{
    console.log("monoDB conneted to port 5000 ");
    
 }).catch((err) => {
    console.log("failed to connect database");
    
 });

 async function main() {
    mongoose.connect(url);
 }

const authRoute = require('./routes/authRoute');
const companyRoutes = require('./routes/companyRoutes')

app.use('/api',authRoute);
app.use('/api/companies', companyRoutes,)

// app.get('/',(req,res)=>{
//    res.send("server is working");
    
// });

const port = process.env.port ;
 app.listen(port,() => {
    console.log("port 5000 is working");
    
 });
