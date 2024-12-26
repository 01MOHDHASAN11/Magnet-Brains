import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // For making HTTP requests

const MainPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/admin/employees', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setEmployees(response.data.employees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleDelete = async (employeeId, taskId) => {
    try {
      await axios.delete(`/api/admin/delete/${employeeId}/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      setEmployees((prev) =>
        prev.map((employee) => {
          if (employee._id === employeeId) {
            employee.tasks = employee.tasks.filter(task => task._id !== taskId);
          }
          return employee;
        })
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (employeeId, taskId) => {
    
    navigate(`/admin/editTask/${employeeId}/${taskId}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'red'; 
      case 2:
        return 'yellow'; 
      case 3:
        return 'green';  
      default:
        return 'white';
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Description</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) =>
                employee.tasks.map((task) => (
                  <tr key={task._id} style={{ backgroundColor: getPriorityColor(task.priority) }}>
                    <td>{employee.name}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{employee.email}</td>
                    <td>{employee.number}</td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td>{task.priority}</td>
                    <td>
                      <button className="edit" onClick={() => handleEdit(employee._id, task._id)}>
                        Edit
                      </button>
                      <button className="delete" onClick={() => handleDelete(employee._id, task._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

<style>
  {`
    .table-container {
      margin: 20px auto;
      width: 90%;
      max-width: 1200px;
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    thead {
      background-color: #4CAF50;
      color: white;
      font-weight: bold;
    }
    
    th, td {
      padding: 10px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    tr:hover {
      background-color: #f1f1f1;
    }
    
    tr[data-priority="1"] {
      background-color: #ffcccc;
    }
    
    tr[data-priority="2"] {
      background-color: #ffffcc;
    }
    
    tr[data-priority="3"] {
      background-color: #d4f7d4;
    }
    
    button {
      padding: 5px 10px;
      margin: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    button:hover {
      opacity: 0.8;
    }
    
    button.edit {
      background-color: #4CAF50;
      color: white;
    }
    
    button.delete {
      background-color: #f44336;
      color: white;
    }
    
    @media screen and (max-width: 768px) {
      table {
        font-size: 12px;
      }
      th, td {
        padding: 8px;
      }
      button {
        font-size: 12px;
      }
    }
  `}
</style>

    </div>
  );
};

export default MainPage;
