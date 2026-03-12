import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from './PageTransition';

const Layout = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="flex flex-col min-h-screen bg-edge-white font-sans text-edge-black overflow-x-hidden">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          {outlet && (
            <PageTransition key={location.pathname}>
              {outlet}
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
