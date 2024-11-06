/* eslint-disable no-unused-vars */
// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';// make sure to import Routes
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Help from "./components/Help";

const App = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/help" element={<Help />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
