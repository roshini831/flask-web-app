import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, Checkbox, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Stack } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, CalendarToday, Google } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../api';
export const TaskList = ({ project }) => {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('medium');
    const [newTaskDate, setNewTaskDate] = useState(null);
    const loadTasks = async () => {
        try {
            const res = await api.getProjectTasks(project.id);
            setTasks(res.tasks);
        }
        catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        loadTasks();
    }, [project.id]);
    const handleCreate = async () => {
        try {
            await api.createTask(project.id, newTaskTitle, newTaskDesc, undefined, newTaskPriority, newTaskDate ? newTaskDate.toISOString() : undefined);
            setOpen(false);
            setNewTaskTitle('');
            setNewTaskDesc('');
            setNewTaskDate(null);
            loadTasks();
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Delete task?'))
            return;
        try {
            await api.deleteTask(id);
            loadTasks();
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleToggle = async (task) => {
        try {
            const status = task.status === 'completed' ? 'todo' : 'completed';
            await api.updateTask(task.id, undefined, undefined, status);
            loadTasks();
        }
        catch (err) {
            console.error(err);
        }
    };
    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };
    return (_jsxs(Box, { sx: { p: 4, flex: 1, overflow: 'auto' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 4 }, children: [_jsx(Typography, { variant: "h4", children: project.name }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => setOpen(true), children: "Add Task" })] }), _jsx(List, { children: tasks.map((task) => (_jsxs(ListItem, { sx: {
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                    }, secondaryAction: _jsx(IconButton, { edge: "end", onClick: () => handleDelete(task.id), children: _jsx(DeleteIcon, {}) }), children: [_jsx(Checkbox, { checked: task.status === 'completed', onChange: () => handleToggle(task) }), _jsxs(Box, { sx: { flex: 1, ml: 1 }, children: [_jsx(Typography, { variant: "body1", sx: {
                                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                        color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                                    }, children: task.title }), _jsxs(Stack, { direction: "row", spacing: 1, mt: 0.5, children: [_jsx(Chip, { label: task.priority, size: "small", color: getPriorityColor(task.priority), variant: "outlined" }), task.due_date && (_jsx(Chip, { icon: _jsx(CalendarToday, { sx: { fontSize: '1rem !important' } }), label: new Date(task.due_date).toLocaleDateString(), size: "small", variant: "outlined" })), task.google_event_id && (_jsx(Chip, { icon: _jsx(Google, { sx: { fontSize: '1rem !important' } }), label: "Synced", size: "small", color: "info", variant: "outlined" }))] })] })] }, task.id))) }), _jsxs(Dialog, { open: open, onClose: () => setOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "New Task" }), _jsxs(DialogContent, { children: [_jsx(TextField, { autoFocus: true, margin: "dense", label: "Task Title", fullWidth: true, value: newTaskTitle, onChange: (e) => setNewTaskTitle(e.target.value) }), _jsx(TextField, { margin: "dense", label: "Description", fullWidth: true, multiline: true, rows: 3, value: newTaskDesc, onChange: (e) => setNewTaskDesc(e.target.value) }), _jsxs(TextField, { select: true, margin: "dense", label: "Priority", fullWidth: true, value: newTaskPriority, onChange: (e) => setNewTaskPriority(e.target.value), children: [_jsx(MenuItem, { value: "low", children: "Low" }), _jsx(MenuItem, { value: "medium", children: "Medium" }), _jsx(MenuItem, { value: "high", children: "High" })] }), _jsx(Box, { mt: 2, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(DateTimePicker, { label: "Due Date", value: newTaskDate, onChange: (newValue) => setNewTaskDate(newValue), slotProps: { textField: { fullWidth: true } } }) }) })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleCreate, variant: "contained", children: "Create" })] })] })] }));
};
