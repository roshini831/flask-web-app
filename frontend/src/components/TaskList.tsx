import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    Checkbox,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, CalendarToday, Google } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api, { Project, Task } from '../api';

interface TaskListProps {
    project: Project;
}

export const TaskList: React.FC<TaskListProps> = ({ project }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [open, setOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('medium');
    const [newTaskDate, setNewTaskDate] = useState<Date | null>(null);

    const loadTasks = React.useCallback(async () => {
        try {
            const res = await api.getProjectTasks(project.id);
            setTasks(res.tasks);
        } catch (err) {
            console.error(err);
        }
    }, [project.id]);

    useEffect(() => {
        // eslint-disable-next-line
        loadTasks();
    }, [loadTasks]);

    const handleCreate = async () => {
        try {
            await api.createTask(
                project.id,
                newTaskTitle,
                newTaskDesc,
                undefined,
                newTaskPriority,
                newTaskDate ? newTaskDate.toISOString() : undefined
            );
            setOpen(false);
            setNewTaskTitle('');
            setNewTaskDesc('');
            setNewTaskDate(null);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete task?')) return;
        try {
            await api.deleteTask(id);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (task: Task) => {
        try {
            const status = task.status === 'completed' ? 'todo' : 'completed';
            await api.updateTask(task.id, undefined, undefined, status);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 4, flex: 1, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4">{project.name}</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Add Task
                </Button>
            </Box>

            <List>
                {tasks.map((task) => (
                    <ListItem
                        key={task.id}
                        sx={{
                            bgcolor: 'background.paper',
                            mb: 1,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                        secondaryAction={
                            <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <Checkbox
                            checked={task.status === 'completed'}
                            onChange={() => handleToggle(task)}
                        />
                        <Box sx={{ flex: 1, ml: 1 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                    color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                                }}
                            >
                                {task.title}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={0.5}>
                                <Chip
                                    label={task.priority}
                                    size="small"
                                    color={getPriorityColor(task.priority) as any}
                                    variant="outlined"
                                />
                                {task.due_date && (
                                    <Chip
                                        icon={<CalendarToday sx={{ fontSize: '1rem !important' }} />}
                                        label={new Date(task.due_date).toLocaleDateString()}
                                        size="small"
                                        variant="outlined"
                                    />
                                )}
                                {task.google_event_id && (
                                    <Chip
                                        icon={<Google sx={{ fontSize: '1rem !important' }} />}
                                        label="Synced"
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                    />
                                )}
                            </Stack>
                        </Box>
                    </ListItem>
                ))}
            </List>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Task Title"
                        fullWidth
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Priority"
                        fullWidth
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value)}
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </TextField>

                    <Box mt={2}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Due Date"
                                value={newTaskDate}
                                onChange={(newValue) => setNewTaskDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
