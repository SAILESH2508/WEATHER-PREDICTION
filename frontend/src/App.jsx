import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

function App() {
  const [locationName, setLocationName] = useState('');

  return (
    <Router>
      <div className="App">
        <Sidebar setLocationName={setLocationName} />
        <div className="main-content-wrapper">
          <Navbar />
          <main className="flex-grow-1 p-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard locationName={locationName} />} />
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
