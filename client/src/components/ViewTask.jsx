import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const ViewTask = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({
    title: '',
    description: '',
    status: '',
    dueDate: '',
    priority: ''
  });
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        alert('Session expired. Please log in again.');
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/employee/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data.tasks || []); 
      } catch (error) {
        console.error('Error fetching tasks:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Failed to fetch tasks. Please try again.');
        if (error.response?.status === 403) {
          navigate('/');
        }
      }
    };

    fetchTasks();
  }, [navigate]);
  const handleEdit = (task) => {
    setCurrentTask(task);
    setUpdatedTask({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      priority: task.priority,
    });
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('employeeToken');
        if (!token) {
          alert('Session expired. Please log in again.');
          navigate('/');
          return;
        }

        const response = await axios.delete(`http://localhost:8000/employee/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setTasks(tasks.filter((task) => task._id !== taskId)); 
          alert('Task deleted successfully.');
        }
      } catch (error) {
        console.error('Error deleting task:', error.response ? error.response.data : error.message);
        alert('Failed to delete task. Please try again.');
      }
    }
  };
  const handleUpdateTask = async () => {
    if (!updatedTask.title || !updatedTask.description || !updatedTask.dueDate || !updatedTask.priority) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('employeeToken');
      const updatedPriority = parseInt(updatedTask.priority, 10);

      await axios.put(
        `http://localhost:8000/employee/task/${currentTask._id}`,
        { ...updatedTask, priority: updatedPriority },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(
        tasks.map((task) =>
          task._id === currentTask._id ? { ...task, ...updatedTask, priority: updatedPriority } : task
        )
      );
      setShowModal(false);
      alert('Task updated successfully.');
    } catch (error) {
      console.error('Error updating task:', error.response ? error.response.data : error.message);
      alert('Failed to update task. Please try again.');
    }
  };

  const getRowStyle = (priority) => {
    switch (priority) {
      case 1:
        return { backgroundColor: 'lightcoral' };  
      case 2:
        return { backgroundColor: 'lightyellow' };  
      case 3:
        return { backgroundColor: 'lightgreen' };  
      default:
        return {};
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>View Tasks</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.headerCell}>Title</th>
            <th style={styles.headerCell}>Description</th>
            <th style={styles.headerCell}>Status</th>
            <th style={styles.headerCell}>Due Date</th>
            <th style={styles.headerCell}>Priority</th>
            <th style={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id} style={getRowStyle(task.priority)}>
                <td style={styles.cell}>{task.title}</td>
                <td style={styles.cell}>{task.description}</td>
                <td style={styles.cell}>{task.status}</td>
                <td style={styles.cell}>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td style={styles.cell}>
                  {task.priority === 1
                    ? 'Top'
                    : task.priority === 2
                    ? 'Medium'
                    : 'Low'}
                </td>
                <td style={styles.cell}>
                  <button onClick={() => handleEdit(task)} className="btn btn-warning btn-sm">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: '10px' }}
                  >
                    <i className="bi bi-trash"></i> 
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={styles.noDataCell}>
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={updatedTask.title}
              onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
              className="form-control"
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Description:</label>
            <textarea
              value={updatedTask.description}
              onChange={(e) =>
                setUpdatedTask({ ...updatedTask, description: e.target.value })
              }
              className="form-control"
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Status:</label>
            <select
              value={updatedTask.status}
              onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.value })}
              className="form-control"
            >
              <option value="Incomplete">Incomplete</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Due Date:</label>
            <input
              type="date"
              value={updatedTask.dueDate}
              onChange={(e) => setUpdatedTask({ ...updatedTask, dueDate: e.target.value })}
              className="form-control"
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Priority:</label>
            <select
              value={updatedTask.priority}
              onChange={(e) => setUpdatedTask({ ...updatedTask, priority: e.target.value })}
              className="form-control"
            >
              <option value="1">Top</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  table: {
    width: '80%',
    margin: '20px auto',
    borderCollapse: 'collapse',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  headerCell: {
    border: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
  cell: {
    fontWeight:600,
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
  },
  noDataCell: {
    textAlign: 'center',
    padding: '20px',
    fontStyle: 'italic',
  },
};

export default ViewTask;
