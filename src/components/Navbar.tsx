import { Link, NavLink } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, loading } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo" />

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/browse" className="nav-link">Browse</NavLink>
          <NavLink to="/blog" className="nav-link">Blog</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
        </nav>

        <div className="nav-actions">
          {loading ? null : user ? (
            <>
              <NavLink to="/profile" className="btn btn-secondary">
                Profile
              </NavLink>

              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-secondary">
                Login
              </NavLink>

              <NavLink to="/signup" className="btn btn-primary">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}