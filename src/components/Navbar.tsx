import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand brand-logo">
         <Link to="/" className="logo" /> </NavLink>

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
          <NavLink to="/blog" className="nav-link">
            Blog
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