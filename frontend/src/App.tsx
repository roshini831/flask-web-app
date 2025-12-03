import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from './theme';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import api from './api';

export const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            await api.healthCheck();
            const tokens = localStorage.getItem('tokens');
            if (tokens) {
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        api.logout();
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
            ) : (
                <Auth onLogin={handleLogin} />
            )}
        </ThemeProvider>
    );
};
