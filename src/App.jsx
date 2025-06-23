import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamDashboard from "./modules/admin/containers/ExamDashboard";
import "./index.css";
import React from 'react';
import NotFound from "./modules/admin/containers/ErrrorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExamDashboard />} />
        <Route path='/error' element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
