import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter , HashRouter } from 'react-router-dom';
import Main from './containers/mainComponent';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import loginReducer from './store/reducers/login'; 
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  logStatus: loginReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
  return (
    <Provider store = {store}>
      <BrowserRouter>
        <div className = "App">
          <Main />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
