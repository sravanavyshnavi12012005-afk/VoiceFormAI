import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FormSelection from "./pages/FormSelection";
import VoiceAssistant from "./pages/VoiceAssistant";
import History from "./pages/History";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      {/* =========================
          NAVIGATION BAR
      ========================= */}

      <Navbar />


      {/* =========================
          APPLICATION ROUTES
      ========================= */}

      <Routes>

        {/* =========================
            PUBLIC PAGES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            PROTECTED DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================
            PROTECTED FORM SELECTION
        ========================= */}

        <Route
          path="/forms"
          element={
            <ProtectedRoute>
              <FormSelection />
            </ProtectedRoute>
          }
        />


        {/* =========================
            PROTECTED VOICE ASSISTANT
        ========================= */}

        <Route
          path="/voice"
          element={
            <ProtectedRoute>
              <VoiceAssistant />
            </ProtectedRoute>
          }
        />


        {/* =========================
            PROTECTED HISTORY
        ========================= */}

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        {/* Keep old submissions URL working */}

        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;