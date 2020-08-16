import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter , HashRouter } from 'react-router-dom';
import Main from './containers/mainComponent';

function App() {
  return (
    <BrowserRouter>
      <div className = "App">
        <Main />
      </div>
    </BrowserRouter>
  );
}

export default App;
