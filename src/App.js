import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
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
        <Route path="/TSG-Task-Kade/customerdetails/:id" exact component={CustomerDetails}/>
        <Route path="/TSG-Task-Kade/calls" exact component={Calls}/>
        <Route path="/TSG-Task-Kade/dashboard" exact component={Dashboard}/>
        <Redirect to="/TSG-Task-Kade/dashboard"/>
      </Switch>
    <ToastContainer />
    </Router>
  );
}

export default App;
