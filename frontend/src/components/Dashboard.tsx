import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Logout, Google } from '@mui/icons-material';
import { ProjectList } from './ProjectList';
import { TaskList } from './TaskList';
import api, { Project } from '../api';

interface DashboardProps {
    onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Task Manager
                    </Typography>
                    <Button
                        startIcon={<Google />}
                        onClick={handleGoogleConnect}
                        sx={{ mr: 2 }}
                    >
                        Connect Calendar
                    </Button>
                    <IconButton onClick={onLogout} color="inherit">
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <ProjectList
                    selectedId={selectedProject?.id || null}
                    onSelect={setSelectedProject}
                />

                {selectedProject ? (
                    <TaskList project={selectedProject} />
                ) : (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h5" color="text.secondary">
                            Select a project to view tasks
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
