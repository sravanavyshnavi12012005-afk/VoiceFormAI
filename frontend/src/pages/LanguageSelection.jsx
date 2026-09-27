import { useLocation, useNavigate } from "react-router-dom";
import "./LanguageSelection.css";

function LanguageSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const form = location.state?.form;

  const languages = [
    {
      name: "English",
      nativeName: "English",
      code: "en-IN",
      icon: "🇬🇧",
    },
    {
      name: "Telugu",
      nativeName: "తెలుగు",
      code: "te-IN",
      icon: "🇮🇳",
    },
    {
      name: "Hindi",
      nativeName: "हिन्दी",
      code: "hi-IN",
      icon: "🇮🇳",
    },
  ];

  const selectLanguage = (language) => {
    navigate("/voice-assistant", {
      state: {
        form: form,
        language: language.name,
        languageCode: language.code,
      },
    });
  };

  if (!form) {
    return (
      <div className="language-page">
        <div className="language-container">
          <h2>❌ No form selected</h2>

          <button onClick={() => navigate("/forms")}>
            ← Select a Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="language-page">
      <div className="language-container">

        <h1>🌐 Choose Your Language</h1>

        <p className="selected-form">
          Form: <strong>{form}</strong>
        </p>

        <p>
          Select the language you want VoiceForm AI to use.
        </p>

        <div className="language-grid">
          {languages.map((language) => (
            <button
              key={language.code}
              className="language-card"
              onClick={() => selectLanguage(language)}
            >
              <span className="language-icon">
                {language.icon}
              </span>

              <span className="language-name">
                {language.name}
              </span>

              <span className="native-name">
                {language.nativeName}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default LanguageSelection;