import LoginPage from './pages/Login Page/LoginPage';
import UserDetailsForm from './pages/User Details/UserDetails';
import UserDashboard from './pages/User DashBoard/UserDashboard';
import AdminDashboard from './pages/Admin Dashboard/AdminDashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/userform" element={<UserDetailsForm />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path='/admindashboard' element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      {/* <AdminDashboard /> */}
      </>
  );
}

export default App;
