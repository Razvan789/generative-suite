import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import { CustomLayout } from './Components/Layout/Layout';
import ImageGenerator from './Pages/ImageGenerator';
import ImageExtender from './Pages/ImageExtender';

const router = createBrowserRouter([
  {
    element: <CustomLayout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/ImageExtender', element: <ImageExtender /> },
      {path: '/ImageGenerator', element: <ImageGenerator/>},  
    ]

  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));




root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
