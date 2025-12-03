
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Tab,
    Tabs,
    Alert,
    Container
} from '@mui/material';
import api from '../api';

interface AuthProps {
    onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.login(email, password);
            onLogin();
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.register(email, username, password);
            onLogin();
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h1" align="center" gutterBottom sx={{ fontSize: '2rem !important' }}>
                        Task Manager
                    </Typography>

                    <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {tab === 0 ? (
                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                size="large"
                                sx={{ mt: 3 }}
                            >
                                Login
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Username"
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                size="large"
                                sx={{ mt: 3 }}
                            >
                                Register
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};
