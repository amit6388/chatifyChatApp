const express = require('express')
const UserRoutes = require('./routes/UserRoutes')
const RoomRoutes = require('./routes/RoomRoutes')
const MessageRoutes = require('./routes/MessageRoutes')
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express()
app.use(express.static(__dirname+'/public'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: true,
  }))
app.get('/',(req,res)=>{
    res.send("welcome to chat-server")
})

app.use('/auth/v1',UserRoutes)
app.use('/api/v1',RoomRoutes)
app.use('/api/v1',MessageRoutes)

module.exports= app