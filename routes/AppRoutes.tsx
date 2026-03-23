import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages';
import LoginPage from '../pages/login';
import AppProvider from '../store';

export default function AppRoutes() {
  return (
    <AppProvider>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </AppProvider>
  );
}
