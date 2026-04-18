import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand brand-logo">
          <img src="/logo.png" alt="FaithTube logo displaying the text FaithTube, symbolizing a community for faith-based videos with an inspirational tone" className="brand-logo-img" />
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/browse" className="nav-link">
            Browse
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </nav>

        <div className="nav-actions">
          <NavLink to="/login" className="btn btn-secondary">
            Login
          </NavLink>
          <NavLink to="/signup" className="btn btn-primary">
            Sign Up
          </NavLink>
        </div>
      </div>
    </header>
  );
}