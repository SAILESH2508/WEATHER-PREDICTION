import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SimulatorPage from './pages/SimulatorPage';
import Analytics from './pages/Analytics';
import About from './pages/About';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="main-content-wrapper">
          <Navbar />
          <main className="flex-grow-1 p-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <NotificationSystem />
        </div>
      </div>
    </Router>
  );
}

export default App;
