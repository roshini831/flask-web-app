import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Paper
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Folder as FolderIcon } from '@mui/icons-material';
import api, { Project } from '../api';

interface ProjectListProps {
    selectedId: number | null;
    onSelect: (project: Project | null) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ selectedId, onSelect }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');

    const loadProjects = React.useCallback(async () => {
        try {
            const res = await api.getProjects();
            setProjects(res.projects);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line
        loadProjects();
    }, [loadProjects]);

    const handleCreate = async () => {
        try {
            await api.createProject(newProjectName, newProjectDesc);
            setOpen(false);
            setNewProjectName('');
            setNewProjectDesc('');
            loadProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm('Are you sure?')) return;
        try {
            await api.deleteProject(id);
            if (selectedId === id) onSelect(null);
            loadProjects();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Paper sx={{ width: 280, height: '100%', overflow: 'auto', borderRadius: 0, borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Projects</Typography>
                <IconButton onClick={() => setOpen(true)} color="primary">
                    <AddIcon />
                </IconButton>
            </Box>
            <List>
                {projects.map((p) => (
                    <ListItem
                        key={p.id}
                        disablePadding
                        secondaryAction={
                            <IconButton edge="end" onClick={(e) => handleDelete(e, p.id)} size="small">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        }
                    >
                        <ListItemButton
                            selected={selectedId === p.id}
                            onClick={() => onSelect(p)}
                        >
                            <FolderIcon sx={{ mr: 2, color: 'primary.main', opacity: 0.8 }} />
                            <ListItemText primary={p.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New Project</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Project Name"
                        fullWidth
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={newProjectDesc}
                        onChange={(e) => setNewProjectDesc(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};
