import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          name: name,
          email: email,
          password: password,
        }
      );

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>🎤 VoiceForm AI</h1>

        <h2>Create Account</h2>

        <p className="login-subtitle">
          Create your account to use VoiceForm AI
        </p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Register
          </button>

        </form>

        {message && (
          <p className="success-message">
            ✅ {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            ❌ {error}
          </p>
        )}

        <p className="register-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;