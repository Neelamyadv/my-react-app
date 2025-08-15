import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './lib/auth.tsx';
import { resetToProductionState } from './lib/cleanupData';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import OfferingsSection from './components/OfferingsSection';
import TrainingSection from './components/Trainingsection.tsx';
import ValuedCertificate from './components/ValuedCertificate';
import ValueCert from './components/ValueaddedPage/valuecert';
import CoursesSection from './components/CoursesSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';
import LoginPage from './components/AuthPages/LoginPage';
import SignupPage from './components/AuthPages/SignupPage';
import AccountPage from './components/AccountPage/AccountPage';
import CoursesPage from './components/CoursesPage/CoursesPage';
import CourseDetailPage from './components/CoursesPage/CourseDetailPage';
import AboutPage from './components/AboutPage/AboutPage';
import PremiumPassPage from './components/PremiumPass/PremiumPassPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage/TermsOfServicePage';
import RefundPolicyPage from './components/RefundPolicyPage/RefundPolicyPage';
import SupportPage from './components/SupportPage/SupportPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import AccessPanel from './components/AdminPanel/AccessPanel';
import WhatsAppFloat from './components/WhatsAppFloat';
import Training from './components/Training/training';
import ValueCertIntro from "./components/ValueaddedPage/ValueCertIntro";
import VAC_TopicSelect from "./components/ValueaddedPage/VAC_TopicSelect";
import VAC_Video from "./components/ValueaddedPage/VAC_Video";
import VAC_Quiz from "./components/ValueaddedPage/VAC_Quiz";
import VAC_Certificate from "./components/ValueaddedPage/VAC_Certificate";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

const AppContent = () => {
  const location = useLocation();
  const hiddenPaths = ['/premium-pass', '/admin', '/access'];
  const isHidden = hiddenPaths.includes(location.pathname);
  
  useEffect(() => {
    const hasRunCleanup = sessionStorage.getItem('zyntiq_cleanup_done');
    if (!hasRunCleanup) {
      resetToProductionState();
      sessionStorage.setItem('zyntiq_cleanup_done', 'true');
    }
  }, []);
  
  const navbar = isHidden ? null : <Navbar />;
  const footer = isHidden ? null : <Footer />;
  const whatsappFloat = (location.pathname === '/admin' || location.pathname === '/access') ? null : <WhatsAppFloat />;
  
  return (
    <div className="min-h-screen yellow-gradient-bg">
      <Toaster position="top-right" />
      {navbar}
      <Routes>
        <Route path="/" element={
          <main>
            <HeroSection />
            <BenefitsSection />
            <OfferingsSection />
            <TrainingSection />
            <ValuedCertificate />
            <CoursesSection />
            <PricingSection />
            <TestimonialsSection />
          </main>
        } />
        {/* The new route for your training page is added here */}
        <Route path="/training" element={<Training />} />
        
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/premium-pass" element={<PremiumPassPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/access" element={<AccessPanel />} />
        <Route path="/live-training" element={<Training />} />
        <Route path="/certificate" element={<ValueCert />} />
        <Route path="/value-certificate" element={<ValueCertIntro />} />
        <Route path="/value-certificate/start" element={<VAC_TopicSelect />} />
        <Route path="/value-certificate/video" element={<VAC_Video />} />
        <Route path="/value-certificate/quiz" element={<VAC_Quiz />} />
        <Route path="/value-certificate/certificate" element={<VAC_Certificate />} />
      </Routes>
      {footer}
      
      {whatsappFloat}
    </div>
  );
}

export default App;
