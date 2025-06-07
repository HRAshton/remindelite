import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from "./Components/dashboard";

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <Dashboard />
        <div id="modal-root"></div>
    </React.StrictMode>
);