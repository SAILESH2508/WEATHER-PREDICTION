import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function App() {
  const [locationName, setLocationName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <Router>
      <div className="App">
        <Sidebar
          setLocationName={setLocationName}
          isOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
        />
        <div className={`main-content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="flex-grow-1 p-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard locationName={locationName} />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay d-lg-none"
            onClick={closeSidebar}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 900
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
