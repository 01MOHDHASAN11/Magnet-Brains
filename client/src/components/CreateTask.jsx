import React from 'react';
import axios from 'axios';
import style from './CreateTask.module.css';
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
  const navigate = useNavigate();
  
  function handleCancel(){
    alert("Task Cancelled");
    navigate('/employeeMainPage');
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const taskData = {
      title: e.target.title.value,
      description: e.target.description.value,
      status: e.target.status.value, 
      dueDate: e.target.dueDate.value,
      priority: e.target.priority.value,
    };
  
    if (!taskData.title || !taskData.description || !taskData.status || !taskData.dueDate || !taskData.priority) {
      alert("Please fill all fields!");
      return;
    }
  
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        alert('Your session has expired. Please log in again.');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:8000/employee/addTask',
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Task added:', response.data);
      alert('Task created successfully!');
      navigate('/employeeMainPage');
    } catch (error) {
      console.error('Request failed:', error.response?.data || error.message);
      alert('Failed to create the task. Please try again.');
    }
  };
  

  return (
    <div>
      <div className={style.posForm}>
        <h3>Create Task</h3>
        <form onSubmit={handleSubmit} className="w-25">
          <label htmlFor="title" className="form-label fs-5 fw-bold">Title</label>
          <input type="text" name="title" className="form-control" />
          
          <label htmlFor="description" className="form-label fs-5 fw-bold">Description</label>
          <input type="text" name="description" className="form-control" />
          
          <label htmlFor="dueDate" className="form-label fs-5 fw-bold">Due date</label>
          <input type="date" name="dueDate" className="form-control" />
          
          <label htmlFor="status" className="form-label fs-5 fw-bold">Status</label>
          <select name="status" className="form-select">
            <option value="Incomplete">Incomplete</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <label htmlFor="priority" className="form-label fs-5 fw-bold">Priority</label>
          <select name="priority" className="form-select">
            <option value="3">Low</option>
            <option value="1">Top</option>
            <option value="2">Medium</option>
          </select>
          
          <div className={style.btnPosition}>
            <button className={style.btnOne} type="button" onClick={handleCancel}>Cancel</button>
            <button className={style.btnTwo} type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
