import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          
          {/* Logo */}
          <Link to="/" className="logo" />

          <div>
            © {new Date().getFullYear()} FaithTube. All rights reserved.
          </div>
        </div>

        <div>
          Original Christian films, Bible stories, and faith-filled videos.
        </div>

        <div className="footer-links">
          <Link to="/about" className="footer-link">
            About
          </Link>
          <Link to="/privacy-policy" className="footer-link">
            Privacy Policy
          </Link>
          <Link to="/terms" className="footer-link">
            Terms
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}