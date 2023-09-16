const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const router = require('./src/route/routes')


dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))


mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("db connected")
}).catch(err => console.log(err))

app.use(cors())

app.use('/',router)


app.listen(process.env.PORT,()=>{
    console.log('server is on')
})




