import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './global.scss';

const el = document.getElementById('root');
if (!el) throw new Error('Root #root not found');

createRoot(el).render(
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
);
