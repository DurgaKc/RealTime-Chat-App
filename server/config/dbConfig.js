const mongoose = require('mongoose')

//connect to mongodb database
mongoose.connect(process.env.CONN_STRING);

//connection state
const db = mongoose.connection;

//check DB Connection
db.on("connected", ()=>{
    console.log('DB connection successful')
})

db.on('err', () =>{
    console.log('DB Connection failed')
})

module.exports = db;