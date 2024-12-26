const admindb = require("../models/admin");
const express = require("express");
const employeeDB = require("../routes/employeeRoute")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/authenticatedEmployee")
require("dotenv").config()
const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    console.log(req.body)
    const {Name,Email,Number,Password} = req.body;
    console.log(req.body)
    if (!Name || !Email || !Number || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const checkExistingUser = await admindb.findOne({ Email });
    if (checkExistingUser) {
      return res.status(409).json({ message: "User already registered" });
    }
    const salt =await bcrypt.genSalt(10);
    const hashedPassword =await bcrypt.hash(Password, salt);
    const newUser = new admindb({
      Name,
      Email,
      Number,
      Password: hashedPassword,
    });
    console.log(newUser)
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Enternal server error"});
  }
});

router.post("/login",async(req,res)=>{
  try {
    const {Email,Password}=req.body
    const existingEmailId= await admindb.findOne({Email})
    if(!existingEmailId){
      return res.status(401).json({message:"Invalid credientials"})
    }
    const passwordMatch = await bcrypt.compare(Password,existingEmailId.Password)
    if(!passwordMatch){
      return res.status(401).json({message:"invalid password"})
    }

    const token = jwt.sign(
      {id:existingEmailId._id,email:existingEmailId.Email,name:existingEmailId.Name},
      process.env.SECRET_KEY,
      {expiresIn:'1h'}
    )

    res.status(200).json({
      message:"Login successfull",
      token,
      user:{id:existingEmailId._id,email:existingEmailId.Email,name:existingEmailId.Name}

    })
  } catch (error) {
      res.status(500).json({ message: "Internal server error"});
  }
})

router.get('/employees', verifyToken, async (req, res) => {
  try {
    const employees = await employeeDB.find({}).select('name email number tasks');
    if (!employees) {
      return res.status(404).json({ message: "No employees found" });
    }
    res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal server error while fetching employees" });
  }
});




module.exports = router;
