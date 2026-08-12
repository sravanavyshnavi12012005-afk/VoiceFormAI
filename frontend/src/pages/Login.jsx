import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email: email,
          password: password,
        }
      );

      console.log("Login response:", response.data);

      // Save logged-in user
      const loggedInUser = {
        name: response.data.name,
        email: response.data.email,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      // Tell Navbar that login happened
      window.dispatchEvent(new Event("authChanged"));

      setMessage("✅ Login successful!");

      // Go directly to Dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setError(
          error.response.data.detail ||
          "Invalid email or password."
        );
      } else {
        setError(
          "❌ Unable to connect to the server. Make sure FastAPI is running."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>🎤 VoiceForm AI</h1>

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Login to continue using VoiceForm AI
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;