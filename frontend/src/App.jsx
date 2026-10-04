import { useState } from 'react';
import { OwnerProvider } from './context/OwnerContext';
import { DataProvider } from './context/DataContext';
import useReveal from './hooks/useReveal';
import ThreeBackground from './components/layout/ThreeBackground';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ResumeModal from './components/modals/ResumeModal';
import OwnerLoginModal from './components/modals/OwnerLoginModal';
import Home from './pages/Home';

export default function App() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  useReveal();

  return (
    <OwnerProvider>
      <DataProvider>
        <div className="aur"><i /><i /><i /></div>
        <ThreeBackground />
        <Navbar onResume={() => setResumeOpen(true)} />
        <Home onResume={() => setResumeOpen(true)} />
        <Footer onLogin={() => setLoginOpen(true)} />
        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
        <OwnerLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </DataProvider>
    </OwnerProvider>
  );
}
