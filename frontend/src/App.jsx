import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import FormSelection from "./pages/FormSelection";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import VoiceAssistant from "./pages/VoiceAssistant";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/voice" element={<VoiceAssistant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forms" element={<FormSelection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;