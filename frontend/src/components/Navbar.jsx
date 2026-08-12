import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const updateUser = () => {
      const savedUser = localStorage.getItem("user");

      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        🎤 VoiceForm AI
      </div>

      {/* Navigation */}
      <ul className="nav-links">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <a href="/#features">Features</a>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>

        {user && (
          <li>
            <Link to="/history">📋 History</Link>
          </li>
        )}

      </ul>

      {/* Login / Logout */}
      {user ? (
        <button
          className="login-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="login-btn"
        >
          Login
        </Link>
      )}

    </nav>
  );
}

export default Navbar;