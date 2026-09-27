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
import LanguageSelection from "./pages/LanguageSelection";
import UploadForm from "./pages/UploadForm";
import "./App.css";
import UploadedForm from "./pages/UploadedForm";

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
          path="/upload-form"
          element={
          <ProtectedRoute>
            <UploadForm />
             </ProtectedRoute>
            }
            
        />
        <Route
         path="/uploaded-form"
         element={
         <ProtectedRoute>
          <UploadedForm />
          </ProtectedRoute>
        }
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
            LANGUAGE SELECTION
        ========================= */}

        <Route
          path="/language"
          element={
            <ProtectedRoute>
              <LanguageSelection />
            </ProtectedRoute>
          }
        />

        {/* =========================
            DASHBOARD
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
            FORM SELECTION
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
            VOICE ASSISTANT
        ========================= */}

        <Route
          path="/voice-assistant"
          element={
            <ProtectedRoute>
              <VoiceAssistant />
            </ProtectedRoute>
          }
        />

        {/* =========================
            OLD VOICE URL
            Keeps previous links working
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
            FORM HISTORY
        ========================= */}

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        {/* =========================
            OLD SUBMISSIONS URL
        ========================= */}

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