import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Paper } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Folder as FolderIcon } from '@mui/icons-material';
import api from '../api';
export const ProjectList = ({ selectedId, onSelect }) => {
    const [projects, setProjects] = useState([]);
    const [open, setOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const loadProjects = async () => {
        try {
            const res = await api.getProjects();
            setProjects(res.projects);
        }
        catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        loadProjects();
    }, []);
    const handleCreate = async () => {
        try {
            await api.createProject(newProjectName, newProjectDesc);
            setOpen(false);
            setNewProjectName('');
            setNewProjectDesc('');
            loadProjects();
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure?'))
            return;
        try {
            await api.deleteProject(id);
            if (selectedId === id)
                onSelect(null);
            loadProjects();
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs(Paper, { sx: { width: 280, height: '100%', overflow: 'auto', borderRadius: 0, borderRight: 1, borderColor: 'divider' }, children: [_jsxs(Box, { sx: { p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsx(Typography, { variant: "h6", children: "Projects" }), _jsx(IconButton, { onClick: () => setOpen(true), color: "primary", children: _jsx(AddIcon, {}) })] }), _jsx(List, { children: projects.map((p) => (_jsx(ListItem, { disablePadding: true, secondaryAction: _jsx(IconButton, { edge: "end", onClick: (e) => handleDelete(e, p.id), size: "small", children: _jsx(DeleteIcon, { fontSize: "small" }) }), children: _jsxs(ListItemButton, { selected: selectedId === p.id, onClick: () => onSelect(p), children: [_jsx(FolderIcon, { sx: { mr: 2, color: 'primary.main', opacity: 0.8 } }), _jsx(ListItemText, { primary: p.name })] }) }, p.id))) }), _jsxs(Dialog, { open: open, onClose: () => setOpen(false), children: [_jsx(DialogTitle, { children: "New Project" }), _jsxs(DialogContent, { children: [_jsx(TextField, { autoFocus: true, margin: "dense", label: "Project Name", fullWidth: true, value: newProjectName, onChange: (e) => setNewProjectName(e.target.value) }), _jsx(TextField, { margin: "dense", label: "Description", fullWidth: true, multiline: true, rows: 3, value: newProjectDesc, onChange: (e) => setNewProjectDesc(e.target.value) })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleCreate, variant: "contained", children: "Create" })] })] })] }));
};
