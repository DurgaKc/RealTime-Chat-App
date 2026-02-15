const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config({path:'./config.env'});

const dbconfig = require('./config/dbConfig');

const server = require('./app')

const port = process.env.PORT_NUMBER || 3000;

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ extended: true }));

server.listen(port, ()=>{
    console.log('Listening to request on PORT :' + port)
});