import { useState } from 'react'
import { Activity, Brain, User, Bell, ShieldAlert, MessageCircle, Moon, Sun } from 'lucide-react'
import Dashboard from './components/Dashboard'
import Insights from './components/Insights'
import Wellness from './components/Wellness'
import Reports from './components/Reports'
import Chatbot from './components/Chatbot'
import Auth from './components/Auth'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import './App.css'

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const { theme, toggleTheme } = useTheme()

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />
      case 'insights': return <Insights />
      case 'wellness': return <Wellness />
      case 'reports': return <Reports />
      case 'chatbot': return <Chatbot />
      case 'profile': return <div className="glass-card p-4 text-center mt-4"><h2>User Profile Overview</h2><p>Coming Soon</p></div>
      default: return <Dashboard />
    }
  }

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Good Morning, Sankarlal'
      case 'insights': return 'AI Health Analysis'
      case 'wellness': return 'Your Recovery Plan'
      case 'reports': return 'Data & Privacy'
      case 'chatbot': return 'Aura AI Assistant'
      case 'profile': return 'My Profile'
      default: return 'Hello'
    }
  }

  const getHeaderSubtitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Here is your daily health overview.'
      case 'insights': return 'Predictive analytics based on your recent vitals.'
      case 'wellness': return 'Activities and diet tailored to your mental state.'
      case 'reports': return 'Access and manage your encrypted health records.'
      case 'chatbot': return 'Ask questions and get personalized wellness guidance.'
      case 'profile': return 'Manage your account settings and connected devices.'
      default: return ''
    }
  }

  return (
    <div className="app-layout">
      {/* Top Navigation for Desktop/Tablet */}
      <nav className="top-nav">
        <div className="container nav-container">
          <div className="brand">
            <Activity className="brand-icon" size={28} />
            <span>AuraHealth</span>
          </div>

          <div className="nav-links">
            <a href="#dashboard" className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              Dashboard
            </a>
            <a href="#insights" className={`nav-link ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>
              Mental Insights
            </a>
            <a href="#wellness" className={`nav-link ${activeTab === 'wellness' ? 'active' : ''}`} onClick={() => setActiveTab('wellness')}>
              Wellness
            </a>
            <a href="#reports" className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
              Reports
            </a>
            <a href="#chatbot" className={`nav-link ${activeTab === 'chatbot' ? 'active' : ''}`} onClick={() => setActiveTab('chatbot')}>
              Chatbot
            </a>
          </div>

          <div className="user-profile">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="btn-primary" style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', boxShadow: 'none' }}>
              <ShieldAlert size={18} />
              <span>SOS</span>
            </button>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={24} color="var(--text-muted)" />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, background: 'var(--primary)', borderRadius: '50%' }}></div>
            </div>
            <div className="avatar" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
              S
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          <h1 style={{ marginBottom: '8px', fontSize: '2rem' }}>{getHeaderTitle()}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{getHeaderSubtitle()}</p>

          {/* Active Tab Content renders here */}
          {renderContent()}

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          <a href="#dashboard" className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Activity size={24} />
            <span>Home</span>
          </a>
          <a href="#insights" className={`mobile-nav-item ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>
            <Brain size={24} />
            <span>AI</span>
          </a>
          <div className="mobile-nav-item" style={{ position: 'relative', top: '-20px' }}>
            <button style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--danger)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px var(--danger-glow)', cursor: 'pointer' }}>
              <ShieldAlert size={28} />
            </button>
            <span style={{ color: 'var(--danger)', fontWeight: 600, marginTop: '8px' }}>SOS</span>
          </div>
          <a href="#chatbot" className={`mobile-nav-item ${activeTab === 'chatbot' ? 'active' : ''}`} onClick={() => setActiveTab('chatbot')}>
            <MessageCircle size={24} />
            <span>Chat</span>
          </a>
          <a href="#profile" className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={24} />
            <span>Profile</span>
          </a>
        </div>
      </nav>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
