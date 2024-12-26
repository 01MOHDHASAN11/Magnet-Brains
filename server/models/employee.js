
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Incomplete', 'In Progress', 'Completed'], default: 'Incomplete' },
  dueDate: { type: Date, required: true },
  priority: { 
    type: Number, 
    enum: [1, 2, 3],
    default: 3 
  }
});

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  password:{type:String,required: true},
  designation: { type: String, required: true },
  department: { type: String, required: true },
  tasks: [taskSchema],
});

module.exports = mongoose.model('Employee', employeeSchema);
