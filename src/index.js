import React from 'react';
import './index.css';

import App from './App';
import GameSettings from './components/Settings/gameSettings';
import { createRoot } from "react-dom/client";
import reportWebVitals from './reportWebVitals';
import Provider from './context/context';
import Navbar from './components/Navbar/navbar';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Provider>
    <Navbar />
    <App/>
    
    </Provider>);

reportWebVitals();
