import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BrowsePage from "./pages/BrowsePage";
import WatchPage from "./pages/WatchPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";
import BlogPostPage from "./pages/BlogPostPage";
import PublicProfilePage from "./pages/PublicProfilePage";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/watch/:slug" element={<WatchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<PublicProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      </main>

      <Footer />
    </div>
  );
}