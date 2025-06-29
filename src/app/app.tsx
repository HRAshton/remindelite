import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from "./Components/dashboard";
import { Zoomable } from './Components/zoomable/zoomable';

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <Zoomable>
            <Dashboard />
        </Zoomable>
        <div id="modal-root"></div>
    </React.StrictMode>
);