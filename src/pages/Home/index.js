import React, { useEffect, useState } from 'react';

import api from '../../api';

import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import NotesIcon from '@mui/icons-material/Notes';
import ListItemText from '@mui/material/ListItemText';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ForwardIcon from '@mui/icons-material/Forward';

export default function Home() {
    const [userField, setUserField] = useState('');
    const [user, setUser] = useState('');
    const [data, setData] = useState([]);
    const [branches, setBranches] = useState([]);
    const [commits, setCommits] = useState([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (user !== '') {
            const path = `users/${user}/repos`;
            api.get(path).then(response => {
                setData(response.data);
            });
        }
    }, [user]);

    const handleExpand = (panel, branches_url, commits_url) => (event, isExpanded) => {
        if (isExpanded) {
            const pathBranches = branches_url.split("{")[0];
            const pathCommits = commits_url.split("{")[0];
            api.get(pathBranches).then(response => {
                setBranches(response.data);
            });
            api.get(pathCommits).then(response => {
                setCommits(response.data);
            });
        } else {
            setBranches([]);
            setCommits([]);
        }
        setExpanded(isExpanded ? panel : false);
    };

    const getRepos = () => (
        data.map(repo => (
            <Accordion expanded={expanded === repo.id}
                onChange={handleExpand(repo.id, repo.branches_url, repo.commits_url)} TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} 
                    aria-controls={`${repo.id}bh-content`} id={`${repo.id}bh-header`}
                >
                    <Chip label={repo.name} />
                    <Grid container justifyContent={"flex-end"} sx={{ mr:1 }}>
                        <Typography sx={{flexShrink: 0 }} variant="a">
                            {repo.id}
                        </Typography>
                    </Grid>
                </AccordionSummary>
                
                <AccordionDetails>
                    <List>
                        <Divider><Chip label="Description" variant="outlined"/></Divider>
                        <ListItem disablePadding key={repo.id}>
                            <ListItemIcon>
                                <NotesIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary={`${repo.description}`} />
                        </ListItem>
                        <Divider><Chip label="Branches" variant="outlined"/></Divider>
                        {
                            branches.map(branch => (
                                <ListItem disablePadding key={branch.id}>
                                <ListItemIcon>
                                    <AccountTreeIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={`${branch.name}`} />
                                </ListItem>
                            ))
                        }
                        <Divider><Chip label="Commits" variant="outlined"/></Divider>
                        {
                            commits.map(commit => (
                                <ListItem disablePadding key={commit.commit.node_id}>
                                <ListItemIcon>
                                    <ForwardIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={`${commit.commit.message}`} />
                                </ListItem>
                            ))
                        }
                    </List>
                </AccordionDetails>

            </Accordion>
        ))
    );
    
    return (
        <div>
            <Container component="main" >
                <CssBaseline />
                <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="a">
                        <strong>
                            Search for a GitHub user to see their repositories!
                        </strong>
                    </Typography>   
                </Alert>
                <Box 
                    sx={{
                        marginTop: 2,
                        marginBottom: 3,
                        display: 'flex',
                        flexDirection: 'line',
                        alignItems: 'center'
                    }}
                >                      
                    <TextField 
                        margin="normal"
                        fullWidth 
                        id="userField" 
                        label="GitHub User" 
                        name="userField" 
                        autoFocus
                        value={userField}
                        onChange={e => setUserField(e.target.value)}
                        sx={{mr: 2}}
                    />
                    <Button variant="contained" onClick={e => setUser(userField)} endIcon={<SearchIcon />}>Search</Button>
                </Box>
                <Box sx={{ mt: 4, mb: 5 }}>
                    <Typography variant="h6" 
                        sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'left' }}
                    >
                        Repositories
                    </Typography>
                    {getRepos()}               
                </Box>
            </Container>
        </div>
    );
}
