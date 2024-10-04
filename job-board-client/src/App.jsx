import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchBar from './components/SearchBar';
import JobList from './components/JobList';
import axios from 'axios';
import { Container } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
  },
});

const App = () => {
  const [jobs, setJobs] = useState([]);  // State for job results
  const [loading, setLoading] = useState(false);  // State for loading indicator

  // Function to handle the search and API call
  const handleSearch = async (query) => {
    try {
      setLoading(true);  // Set loading state
      const response = await axios.get(`http://localhost:5000/api/jobs`, {
        params: { query },
      });

      // Log the data received from the backend
      console.log('Jobs received from backend:', response.data);

      setJobs(response.data);  // Update job results in the state
      setLoading(false);  // Stop loading indicator
    } catch (error) {
      console.error('Error fetching job listings:', error);
      setLoading(false);  // Stop loading indicator in case of error
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/* SearchBar triggers search and passes query */}
        <SearchBar onSearch={handleSearch} loading={loading} />
        {/* JobList displays the jobs and loading state */}
        <JobList jobs={jobs} loading={loading} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
