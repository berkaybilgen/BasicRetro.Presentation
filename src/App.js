import logo from './logo.svg';
import './App.css';
import TypeColumn from './Components/TypeColumn.js';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState, useRef } from 'react';
import Board from './Board';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Layout
} from 'react-router-dom';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Board />} />
          <Route exact path="/board/:id" element={<Board/>}/>
        </Routes>
    </Router>
  );
}

export default App;
