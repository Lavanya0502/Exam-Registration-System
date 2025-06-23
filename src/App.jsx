import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamDashboard from "./modules/admin/containers/ExamDashboard";
import "./index.css";
import React from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExamDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
