import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import PostJob from './components/PostJob';
import SearchBar from './components/SearchBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployerDashboard from './components/dashboard/EmployerDashboard';
import JobSeekerDashboard from './components/dashboard/JobSeekerDashboard';
import ProfileManagement from './components/profile/ProfileManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            {/* Only show SearchBar on the home page */}
            <Routes>
              <Route path="/" element={
                <>
                  <SearchBar />
                  <JobList />
                </>
              } />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public Routes */}
              <Route path="/jobs/:id" element={<JobDetails />} />

              {/* Protected Routes - Employer */}
              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute roles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute roles={['employer']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Job Seeker */}
              <Route
                path="/jobseeker/dashboard"
                element={
                  <ProtectedRoute roles={['jobseeker']}>
                    <JobSeekerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - All Users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;