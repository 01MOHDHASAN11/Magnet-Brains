import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FrontPage.module.css';

const FrontPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/main'); 
    }
  }, [navigate]);

  const adminLoginPage = () => {
    navigate('/adminLogin');
  };
  const employeeLoginPage = () => {
    navigate('/employeeRegister')
  }

  return (
    <div>
      <header className={`${styles.headerWidth}`}>
        <aside className={`${styles.asideTop}`}>
          <div>
            <img src="magnetBrains.webp" alt="logo512.png" height={80} width={70} />
          </div>
          <div>
            <span className={`${styles.heading}`}>Magnet Brains</span>
          </div>
        </aside>
      </header>
      <section align="center" className={`${styles.centerSection}`}>
        <div>
          <span className={`${styles.paraOne}`}>INDIA'S NO.1</span>
          <div>
            <span className={`${styles.paraTwo}`}>100% Free Online</span>
          </div>
          <div>
            <span className={`${styles.paraTwo}`}>Education Platform</span>
          </div>
        </div>
        <div className={`${styles.optionBtn}`}>
          <button className={`${styles.btnOne}`} onClick={adminLoginPage}>
            Admin
          </button>
          <button className={`${styles.btnTwo}`} onClick={employeeLoginPage}>Employee</button>
        </div>
      </section>
    </div>
  );
};

export default FrontPage;
