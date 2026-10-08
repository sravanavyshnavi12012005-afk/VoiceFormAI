import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UploadForm.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function UploadForm() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setMessage("❌ Please select a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a PDF form first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Uploading your form...");

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "${API_BASE_URL}/upload-form",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Form uploaded successfully!");

      // Go to uploaded-form page instead of Passport voice assistant
      navigate("/uploaded-form", {
         state: {
          fileName: response.data.file_name,
          originalFileName: response.data.original_file_name,
          filePath: response.data.file_path,
         },
        });
    } catch (error) {
      console.error("Upload error:", error);

      setMessage(
        error.response?.data?.detail ||
          "❌ Unable to upload the form. Make sure the backend is running."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">

        <h1>📄 Upload Your Form</h1>

        <p>
          Upload a PDF form and VoiceForm AI will read it and
          help you complete it using your voice.
        </p>

        <div className="upload-box">

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />

          {file && (
            <div className="selected-file">
              <strong>Selected File:</strong>
              <p>📄 {file.name}</p>
            </div>
          )}

        </div>

        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "⬆️ Upload Form"}
        </button>

        {message && (
          <p className="upload-message">
            {message}
          </p>
        )}

        <button
          className="back-button"
          onClick={() => navigate("/forms")}
        >
          ← Back to Forms
        </button>

      </div>
    </div>
  );
}

export default UploadForm;