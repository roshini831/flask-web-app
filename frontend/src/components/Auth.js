import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Tab, Tabs, Alert, Container } from '@mui/material';
import api from '../api';
export const Auth = ({ onLogin }) => {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await api.login(email, password);
            onLogin();
        }
        catch (err) {
            setError(err.message || 'Login failed');
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.register(email, username, password);
            onLogin();
        }
        catch (err) {
            setError(err.message || 'Registration failed');
        }
    };
    return (_jsx(Container, { maxWidth: "sm", sx: { mt: 8 }, children: _jsx(Card, { elevation: 4, children: _jsxs(CardContent, { sx: { p: 4 }, children: [_jsx(Typography, { variant: "h1", align: "center", gutterBottom: true, sx: { fontSize: '2rem !important' }, children: "Task Manager" }), _jsxs(Tabs, { value: tab, onChange: (_, v) => setTab(v), centered: true, sx: { mb: 3 }, children: [_jsx(Tab, { label: "Login" }), _jsx(Tab, { label: "Register" })] }), error && _jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }), tab === 0 ? (_jsxs("form", { onSubmit: handleLogin, children: [_jsx(TextField, { fullWidth: true, label: "Email", type: "email", margin: "normal", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx(TextField, { fullWidth: true, label: "Password", type: "password", margin: "normal", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx(Button, { fullWidth: true, variant: "contained", type: "submit", size: "large", sx: { mt: 3 }, children: "Login" })] })) : (_jsxs("form", { onSubmit: handleRegister, children: [_jsx(TextField, { fullWidth: true, label: "Email", type: "email", margin: "normal", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx(TextField, { fullWidth: true, label: "Username", margin: "normal", value: username, onChange: (e) => setUsername(e.target.value), required: true }), _jsx(TextField, { fullWidth: true, label: "Password", type: "password", margin: "normal", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx(Button, { fullWidth: true, variant: "contained", type: "submit", size: "large", sx: { mt: 3 }, children: "Register" })] }))] }) }) }));
};
