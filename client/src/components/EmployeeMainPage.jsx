import React, { useState, useEffect } from 'react';
import styles from './EmployeeMainPage.module.css';
import { useNavigate } from 'react-router-dom';

const EmployeeMainPage = () => {
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('employeeName');
    const token = localStorage.getItem('employeeToken');

    if (!token) {
      navigate('/');
    } else {
      setEmployeeName(name || 'Employee');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeToken');
    navigate('/');
  };

  const handleTask = () => {
    navigate('/createTask');
  };
  function handleTable(){
    navigate('/viewTable')
  }

  return (
    <>
      <header className="bg-light">
        <nav className={styles.display}>
          <div>
            <span><img src="magnetBrains.webp" alt="Logo" className={styles.imageAdj} /></span>
          </div>
          <div>
            <span className={styles.empName}>{`Welcome ${employeeName}`}</span>
          </div>
          <div>
            <button className={styles.btnAdj} onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>
      <section>
        <main className={styles.mainBtn}>
          <div className={styles.mainDivOne} onClick={handleTask}>
            <span>Create new task</span>
          </div>
          <div className={styles.mainDivTwo} onClick={handleTable}>
            <span>View all Tasks</span>
          </div>
        </main>
      </section>
    </>
  );
};

export default EmployeeMainPage;
