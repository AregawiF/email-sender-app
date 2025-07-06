import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Divider,
  IconButton,
  Chip,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Send as SendIcon
} from '@mui/icons-material';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmail, setNewEmail] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });

  // Fetch emails from backend API
  const fetchEmails = useCallback(async (search = '') => {
    try {
      setLoading(true);
      let url = `${BACKEND_URL}/emails`;
      if (search && search.trim() !== '') {
        url = `${BACKEND_URL}/emails/search?q=${encodeURIComponent(search)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch emails');
      const result = await response.json();
      setEmails(result.data);
      setFilteredEmails(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchEmails(query);
        }, 500);
      };
    })(),
    [fetchEmails]
  );

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleComposeOpen = () => {
    setComposeOpen(true);
  };

  const handleComposeClose = () => {
    setComposeOpen(false);
    setNewEmail({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: ''
    });
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmail),
      });

      if (!response.ok) throw new Error('Failed to send email');
      
      const result = await response.json();
      const sentEmail = result.data;
      setEmails(prev => [sentEmail, ...prev]);
      setFilteredEmails(prev => [sentEmail, ...prev]);
      handleComposeClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSenderInitials = (email) => {
    // Extract sender from 'to' field or use a default
    const sender = email.to || 'Unknown';
    return sender.split('@')[0].substring(0, 2).toUpperCase();
  };

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Email Sidebar */}
      <Paper sx={{ width: 400, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Email List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredEmails.map((email) => (
                <ListItem
                  key={email.id}
                  button
                  selected={selectedEmail?.id === email.id}
                  onClick={() => setSelectedEmail(email)}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: email.read ? 'inherit' : '#f0f8ff',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    py: 2,
                    px: 2,
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                        fontSize: '0.875rem'
                      }}
                    >
                      {getSenderInitials(email)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                    {/* Sender */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: email.read ? 'normal' : 'bold',
                        color: email.read ? 'text.secondary' : 'text.primary',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {email.to}
                    </Typography>
                    
                    {/* Subject */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: email.read ? 'normal' : 'bold',
                        color: email.read ? 'text.secondary' : 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.875rem'
                      }}
                    >
                      {email.subject}
                    </Typography>
                  </Box>
                  
                  {/* Date */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content'
                    }}
                  >
                    {formatDate(email.created_at)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      {/* Email Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedEmail ? (
          <Paper sx={{ flex: 1, m: 2, p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {selectedEmail.subject}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>To:</strong> {selectedEmail.to}
                  </Typography>
                </Grid>
                {selectedEmail.cc && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>CC:</strong> {selectedEmail.cc}
                    </Typography>
                  </Grid>
                )}
                {selectedEmail.bcc && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>BCC:</strong> {selectedEmail.bcc}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date:</strong> {new Date(selectedEmail.created_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {selectedEmail.body}
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <EmailIcon sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6">Select an email to read</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Compose Email FAB */}
      <Fab
        color="primary"
        aria-label="compose"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleComposeOpen}
      >
        <AddIcon />
      </Fab>

      {/* Compose Email Dialog */}
      <Dialog
        open={composeOpen}
        onClose={handleComposeClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Compose Email</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="To"
              fullWidth
              value={newEmail.to}
              onChange={(e) => setNewEmail(prev => ({ ...prev, to: e.target.value }))}
            />
            <TextField
              label="CC"
              fullWidth
              value={newEmail.cc}
              onChange={(e) => setNewEmail(prev => ({ ...prev, cc: e.target.value }))}
            />
            <TextField
              label="BCC"
              fullWidth
              value={newEmail.bcc}
              onChange={(e) => setNewEmail(prev => ({ ...prev, bcc: e.target.value }))}
            />
            <TextField
              label="Subject"
              fullWidth
              value={newEmail.subject}
              onChange={(e) => setNewEmail(prev => ({ ...prev, subject: e.target.value }))}
            />
            <TextField
              label="Body"
              fullWidth
              multiline
              rows={8}
              value={newEmail.body}
              onChange={(e) => setNewEmail(prev => ({ ...prev, body: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleComposeClose}>Cancel</Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            startIcon={<SendIcon />}
            disabled={!newEmail.to || !newEmail.subject}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
