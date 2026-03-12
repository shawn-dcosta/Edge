import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import AdminDashboard from './pages/Admin';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<div className="flex-grow flex items-center justify-center min-h-[50vh]"><h1 className="text-4xl font-black">404 - Page Not Found</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
