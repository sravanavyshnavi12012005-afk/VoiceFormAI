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
    navigate("/voice", {
      state: {
        form: form,
      },
    });
  };

  return (
    <div className="form-selection-page">

      <div className="form-selection-container">

        <h1>📝 Select a Form</h1>

        <p>
          Choose the form you want to complete using your voice.
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

        </div>

      </div>

    </div>
  );
}

export default FormSelection;