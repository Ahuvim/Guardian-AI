// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Make sure to import ProtectedRoute
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/webapp" element={<ProtectedRoute><App /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    {/* Define other routes here */}
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);