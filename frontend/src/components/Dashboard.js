import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Logout, Google } from '@mui/icons-material';
import { ProjectList } from './ProjectList';
import { TaskList } from './TaskList';
import api from '../api';
export const Dashboard = ({ onLogout }) => {
    const [selectedProject, setSelectedProject] = useState(null);
    useEffect(() => {
        // Check for google connection success
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('google_connected') === 'true') {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);
    const handleGoogleConnect = async () => {
        try {
            const res = await api.connectGoogleCalendar();
            window.location.href = res.authorization_url;
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', height: '100vh' }, children: [_jsx(AppBar, { position: "static", color: "transparent", elevation: 0, sx: { borderBottom: 1, borderColor: 'divider' }, children: _jsxs(Toolbar, { children: [_jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1, fontWeight: 700 }, children: "Task Manager" }), _jsx(Button, { startIcon: _jsx(Google, {}), onClick: handleGoogleConnect, sx: { mr: 2 }, children: "Connect Calendar" }), _jsx(IconButton, { onClick: onLogout, color: "inherit", children: _jsx(Logout, {}) })] }) }), _jsxs(Box, { sx: { display: 'flex', flex: 1, overflow: 'hidden' }, children: [_jsx(ProjectList, { selectedId: selectedProject?.id || null, onSelect: setSelectedProject }), selectedProject ? (_jsx(TaskList, { project: selectedProject })) : (_jsx(Box, { sx: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Typography, { variant: "h5", color: "text.secondary", children: "Select a project to view tasks" }) }))] })] }));
};
