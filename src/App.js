import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails'
import Dashboard from './pages/Dashboard';
import Calls from './pages/Calls';
import {ToastContainer} from 'react-toastify';
import {TopNavBar} from './layouts/TopNavBar'
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <Router>
    <TopNavBar />
      <Switch>
        <Route path="/customerdetails/:id" exact component={CustomerDetails}/>
        <Route path="/calls" exact component={Calls}/>
        <Route path="/dashboard" exact component={Dashboard}/>
        <Redirect to="/dashboard"/>
      </Switch>
    <ToastContainer />
    </Router>
  );
}

export default App;
