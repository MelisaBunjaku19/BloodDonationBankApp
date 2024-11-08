// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Help from "./components/Help";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer"; // Import the Footer component

const App = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
                <Footer /> {/* Add Footer at the bottom */}
            </div>
        </Router>
    );
};

export default App;
