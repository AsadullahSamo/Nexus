import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';
import RoleGuard from './routes/RoleGuard'

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Feature Pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';
import { MeetingsPage } from './pages/meetings/MeetingsPage';
import { VideoCallPage } from './pages/video-call/VideoCallPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/video-call/:roomId" element={<VideoCallPage />} />

            <Route element={<DashboardLayout />}>

              {/* Entrepreneur only */}
              <Route element={<RoleGuard allowedRole="entrepreneur" />}>
                <Route path="/dashboard/entrepreneur" element={<EntrepreneurDashboard />} />
              </Route>

              {/* Investor only */}
              <Route element={<RoleGuard allowedRole="investor" />}>
                <Route path="/dashboard/investor" element={<InvestorDashboard />} />
              </Route>

              {/* Shared protected routes */}
              <Route path="/profile/entrepreneur/:id" element={<EntrepreneurProfile />} />
              <Route path="/profile/investor/:id" element={<InvestorProfile />} />
              <Route path="/investors" element={<InvestorsPage />} />
              <Route path="/entrepreneurs" element={<EntrepreneursPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:userId" element={<ChatPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/meetings" element={<MeetingsPage />} />
            </Route>


          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;