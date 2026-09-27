import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadedForm.css";

function UploadedForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const fileName = location.state?.fileName;

  const originalFileName =
    location.state?.originalFileName || fileName;

  const [text, setText] = useState("");
  const [fields, setFields] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const analyzeForm = async () => {

    if (!fileName) {
      setMessage("❌ Uploaded form information was not found.");
      return;
    }

    try {

      setLoading(true);
      setMessage("🔍 Analyzing your form...");

      const response = await axios.get(
        `http://127.0.0.1:8000/analyze-form/${encodeURIComponent(
          fileName
        )}`
      );

      setText(response.data.extracted_text);

      setFields(
        response.data.detected_fields || []
      );

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

  const continueToVoiceAssistant = () => {

    if (questions.length === 0) {
      alert(
        "No form fields were detected."
      );
      return;
    }

    navigate("/voice-assistant", {

      state: {

        uploadedForm: true,

        fileName: fileName,

        originalFileName:
          originalFileName,

        questions: questions

      }

    });

  };

  return (

    <div className="uploaded-form-page">

      <div className="uploaded-form-card">

        <h1>
          📄 Your Uploaded Form
        </h1>

        <div className="file-info">

          <strong>
            Uploaded File:
          </strong>

          <p>
            📄 {originalFileName}
          </p>

        </div>

        <button
          className="analyze-button"
          onClick={analyzeForm}
          disabled={loading || !fileName}
        >

          {loading
            ? "Analyzing Form..."
            : "🔍 Read & Analyze Form"}

        </button>

        {message && (

          <p className="status-message">
            {message}
          </p>

        )}

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