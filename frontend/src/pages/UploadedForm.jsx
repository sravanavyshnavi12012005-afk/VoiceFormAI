import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadedForm.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function UploadedForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // UPLOADED FILE INFORMATION
  // =========================================================

  const fileName = location.state?.fileName || "";

  const originalFileName =
    location.state?.originalFileName || fileName;

  // =========================================================
  // STATE
  // =========================================================

  const [text, setText] = useState("");
  const [fields, setFields] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
  // ANALYZE UPLOADED FORM
  // =========================================================

  const analyzeForm = async () => {
    if (!fileName) {
      setMessage("❌ Uploaded form information was not found.");
      return;
    }

    try {
      setLoading(true);
      setMessage("🔍 Analyzing your form...");

      const response = await axios.get(
        `${API_BASE_URL}/analyze-form/${encodeURIComponent(
          fileName
        )}`
      );

      // Extracted PDF text
      setText(response.data.extracted_text || "");

      // Detected fields
      setFields(
        response.data.detected_fields || []
      );

      // Generated questions
      setQuestions(
        response.data.questions || []
      );

      setMessage(
        "✅ Form analyzed successfully!"
      );

    } catch (error) {
      console.error(
        "Form analysis error:",
        error
      );

      setMessage(
        error.response?.data?.detail ||
          "❌ Unable to analyze the form."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CONTINUE TO VOICE ASSISTANT
  // =========================================================

  const continueToVoiceAssistant = () => {
    if (questions.length === 0) {
      alert(
        "No form fields were detected."
      );
      return;
    }

    // Get selected language
    const selectedLanguage =
      localStorage.getItem("selectedLanguage") ||
      "English";

    // IMPORTANT:
    // Send uploadedForm = true
    // Send the uploaded questions
    // Send the uploaded PDF file name
    // VoiceAssistant will use these instead of Passport questions

    navigate("/voice-assistant", {
      state: {
        uploadedForm: true,

        form: "Uploaded Form",

        fileName: fileName,

        originalFileName: originalFileName,

        questions: questions,

        language: selectedLanguage,
      },
    });
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="uploaded-form-page">

      <div className="uploaded-form-card">

        {/* PAGE TITLE */}
        <h1>
          📄 Your Uploaded Form
        </h1>

        {/* FILE INFORMATION */}
        <div className="file-info">

          <strong>
            Uploaded File:
          </strong>

          <p>
            📄 {originalFileName}
          </p>

        </div>

        {/* ANALYZE BUTTON */}
        <button
          className="analyze-button"
          onClick={analyzeForm}
          disabled={loading || !fileName}
        >
          {loading
            ? "Analyzing Form..."
            : "🔍 Read & Analyze Form"}
        </button>

        {/* STATUS MESSAGE */}
        {message && (
          <p className="status-message">
            {message}
          </p>
        )}

        {/* DETECTED FIELDS */}
        {fields.length > 0 && (
          <div className="detected-section">

            <h2>
              🔎 Detected Form Fields
            </h2>

            <div className="field-list">

              {fields.map(
                (field, index) => (
                  <div
                    className="field-item"
                    key={index}
                  >
                    {index + 1}. {field}
                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* GENERATED QUESTIONS */}
        {questions.length > 0 && (
          <div className="questions-section">

            <h2>
              🎤 Questions VoiceForm AI Will Ask
            </h2>

            {questions.map(
              (question, index) => (
                <div
                  className="question-item"
                  key={index}
                >
                  <strong>
                    {index + 1}.
                  </strong>{" "}

                  {question}
                </div>
              )
            )}

            {/* START VOICE FORM */}
            <button
              className="continue-button"
              onClick={
                continueToVoiceAssistant
              }
            >
              🎤 Start Voice Form Filling
            </button>

          </div>
        )}

        {/* EXTRACTED PDF TEXT */}
        {text && (
          <details className="text-section">

            <summary>
              📖 View Extracted PDF Text
            </summary>

            <div className="extracted-text">
              {text}
            </div>

          </details>
        )}

        {/* BACK BUTTON */}
        <button
          className="back-button"
          onClick={() =>
            navigate("/forms")
          }
        >
          ← Back to Forms
        </button>

      </div>

    </div>
  );
}

export default UploadedForm;