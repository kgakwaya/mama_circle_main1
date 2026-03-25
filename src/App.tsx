import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import Navbar    from './components/Navbar';
import Landing   from './pages/Landing';
import Auth      from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Forums    from './pages/Forums';
import Groups    from './pages/Groups';
import Chat      from './pages/Chat';
import Admin     from './pages/Admin';

function App() {
  const { user } = useSelector((state: RootState) => state.auth) as any;

  const Private   = ({ children }: { children: JSX.Element }) =>
    user ? children : <Navigate to="/" replace />;

  const AdminOnly = ({ children }: { children: JSX.Element }) =>
    user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;

  return (
    <Router>
      <div className="min-h-screen bg-ivory">
        {user && <Navbar />}
        <Routes>
          <Route path="/"          element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/auth"      element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/forums"    element={<Private><Forums /></Private>} />
          <Route path="/groups"    element={<Private><Groups /></Private>} />
          <Route path="/chat"      element={<Private><Chat /></Private>} />
          <Route path="/admin"     element={<AdminOnly><Admin /></AdminOnly>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
