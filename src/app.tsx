import { createRoot } from 'react-dom/client';
import { Dashboard } from "./Components/dashboard";
import React from 'react';

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <Dashboard />
        <div id="modal-root"></div>
    </React.StrictMode>
);