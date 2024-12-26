const express=require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const adminRoutes =require('../routes/adminRoutes')
const employeeRoutes =require('../routes/employeeRoute')
require("dotenv").config()
const app=express()
app.use(cors());
app.use(express.json())

app.use('/admin',adminRoutes)
app.use('/employee',employeeRoutes)

const PORT=process.env.PORT
const url=process.env.DATABASE_URL

const run=async()=>{
    try {
        await mongoose.connect(url)
        console.log("Connected to mongoDB")
    } catch (error) {
        console.log("Error connecting to database",error)
    }
}
run()

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
