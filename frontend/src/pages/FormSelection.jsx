import { useNavigate } from "react-router-dom";
import "./FormSelection.css";

function FormSelection() {
  const navigate = useNavigate();

  const forms = [
    "Passport",
    "College Admission",
    "Scholarship",
    "Hospital Registration",
    "Job Application",
  ];

  const selectForm = (form) => {
    navigate("/language", {
      state: { form },
    });
  };

  const uploadOwnForm = () => {
    navigate("/upload-form");
  };

  return (
    <div className="form-page">
      <div className="form-container">

        <h1>📝 Select a Form</h1>

        <p>
          Choose the form you want to complete using VoiceForm AI.
        </p>

        <div className="form-grid">
          {forms.map((form) => (
            <button
              key={form}
              onClick={() => selectForm(form)}
            >
              {form}
            </button>
          ))}

          {/* Upload your own PDF */}
          <button
            onClick={uploadOwnForm}
          >
            📄 Upload My Own Form
          </button>
        </div>

      </div>
    </div>
  );
}

export default FormSelection;