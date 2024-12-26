const employeeDB = require("../models/employee");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticatedEmployee");
const verifyToken = require('../middleware/viewTableAuthentication');
require("dotenv").config();
const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { name, email, number, password, designation, department } = req.body;

    if (!name || !email || !number || !password || !designation || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const checkExistingUser = await employeeDB.findOne({ email });
    if (checkExistingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Hashed password:", hashedPassword); 

    const newUser = new employeeDB({
      name,
      email,
      number,
      password: hashedPassword,  
      designation,
      department,
    });

    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.post("/login", async (req, res) => {
  console.log("Request body:", req.body);  
  try {
    const { email, password } = req.body; 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingEmailId = await employeeDB.findOne({ email });
    
    if (!existingEmailId) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User found, checking password for email:", email);

    const passwordMatch = await bcrypt.compare(password, existingEmailId.password);
    
    if (!passwordMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: existingEmailId._id, email: existingEmailId.email, name: existingEmailId.name },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: existingEmailId._id, email: existingEmailId.email, name: existingEmailId.name }
    });
  } catch (error) {
    console.error('Error in login route:', error);
    
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



router.post("/addTask", authenticate, async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;

    if (!title || !description || !status || !dueDate || !priority) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in again." });
    }

    const user = await employeeDB.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTask = {
      title,
      description,
      status,
      dueDate: new Date(dueDate), 
      priority,
    };

    user.tasks.push(newTask);
    await user.save();

    res.status(200).json({ message: "Task added successfully", tasks: user.tasks });

  } catch (error) {
    console.error("Error while adding task:", error);  
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

router.get("/tasks", verifyToken, async (req, res) => {
  try {
    const user = await employeeDB.findById(req.user.id).select("tasks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasks = user.tasks.map((task) => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      priority: task.priority,
    }));

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put('/task/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, dueDate, priority } = req.body;

  try {
    const employee = await employeeDB.findOne({ 'tasks._id': taskId });

    if (!employee) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = employee.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title;
    task.description = description;
    task.status = status;
    task.dueDate = new Date(dueDate);
    task.priority = priority;

    await employee.save();

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error while updating task.' });
  }
});

router.delete('/task/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const employee = await employeeDB.findOne({ 'tasks._id': taskId });

    if (!employee) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const taskExists = employee.tasks.id(taskId);
    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    employee.tasks.pull({ _id: taskId });

    await employee.save();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error); 
    res.status(500).json({ message: 'Internal server error while deleting task.', error: error.message });
  }
});





module.exports = router;
