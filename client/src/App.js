import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './components/MainPage';
import FrontPage from './components/FrontPage';
import EmployeeLogin from "./components/EmployeeLogin";
import EmployeeRegister from './components/EmployeeRegister';
import EmployeeMainPage from "./components/EmployeeMainPage";
import ProtectedEmployeeRoute from "./components/ProtectedEmployeeMain.jsx";
import CreateTask from './components/CreateTask.jsx';
import ViewTask from './components/ViewTask.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/employeeLogin" element={<EmployeeLogin />} />
        <Route path="/employeeRegister" element={<EmployeeRegister />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employeeMainPage"
          element={
            <ProtectedEmployeeRoute>
              <EmployeeMainPage />
            </ProtectedEmployeeRoute>
          }
        />
        <Route path='/createTask' element={
          <ProtectedEmployeeRoute>
            <CreateTask/>
          </ProtectedEmployeeRoute>
        }/>
        <Route path='/viewTable' element={
          <ProtectedEmployeeRoute>
            <ViewTask/>
          </ProtectedEmployeeRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
