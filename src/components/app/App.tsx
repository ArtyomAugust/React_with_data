import React from 'react';
import logo from './logo.svg';
import './App.css';
import Function from "../function/Function";
import Table from "../table/Table";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/function' element={<Function />}/>
        <Route path='/' element={<Table />}/>
      </Routes>
    </Router>
  );
}

export default App;
