import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./VoiceAssistant.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function VoiceAssistant() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // FORM
  // =========================================================

const uploadedForm =
  location.state?.uploadedForm || false;

const form =
  uploadedForm
    ? "Uploaded Form"
    : location.state?.form || "Passport";
  // =========================================================
  // GET SELECTED LANGUAGE
  // =========================================================

  const getSelectedLanguage = () => {
    // First check navigation state
    if (location.state?.language) {
      return location.state.language;
    }

    // Then check localStorage
    const savedLanguage =
      localStorage.getItem("selectedLanguage") ||
      localStorage.getItem("language") ||
      localStorage.getItem("formLanguage");

    return savedLanguage || "English";
  };

  const selectedLanguage = getSelectedLanguage();

  // =========================================================
  // LANGUAGE CONFIGURATION
  // =========================================================

  const languageConfig = {
    English: {
      code: "en-IN",
      name: "English",
    },

    Telugu: {
      code: "te-IN",
      name: "Telugu",
    },

    Hindi: {
      code: "hi-IN",
      name: "Hindi",
    },
  };

  const language =
    languageConfig[selectedLanguage] ||
    languageConfig.English;

  // =========================================================
  // QUESTIONS
  // =========================================================

  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [speech, setSpeech] = useState(
    "Click Start Voice Assistant to begin."
  );

  const [loading, setLoading] =
    useState(true);

  const [completed, setCompleted] =
    useState(false);

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================================================
  // TRANSLATIONS
  // =========================================================

  const translations = {
    Telugu: {
      Passport: [
        "మీ పూర్తి పేరు ఏమిటి?",
        "మీ పుట్టిన తేదీ ఏమిటి?",
        "మీ ఆధార్ నంబర్ ఏమిటి?",
        "మీ చిరునామా ఏమిటి?",
      ],

      "College Admission": [
        "మీ పూర్తి పేరు ఏమిటి?",
        "మీ ఇంటర్మీడియట్ శాతం ఎంత?",
        "మీరు ఏ కోర్సులో చేరాలనుకుంటున్నారు?",
        "మీ ఫోన్ నంబర్ ఏమిటి?",
      ],

      Scholarship: [
        "మీ పూర్తి పేరు ఏమిటి?",
        "మీ కుటుంబ వార్షిక ఆదాయం ఎంత?",
        "మీరు ఏ కళాశాలలో చదువుతున్నారు?",
        "మీ బ్యాంక్ ఖాతా నంబర్ ఏమిటి?",
      ],

      "Hospital Registration": [
        "మీ పూర్తి పేరు ఏమిటి?",
        "మీ వయస్సు ఎంత?",
        "మీ రక్త వర్గం ఏమిటి?",
        "మీకు ఉన్న లక్షణాలు ఏమిటి?",
      ],

      "Job Application": [
        "మీ పూర్తి పేరు ఏమిటి?",
        "మీ విద్యార్హత ఏమిటి?",
        "మీకు ఎన్ని సంవత్సరాల పని అనుభవం ఉంది?",
        "మీ ఇమెయిల్ చిరునామా ఏమిటి?",
      ],
    },

    Hindi: {
      Passport: [
        "आपका पूरा नाम क्या है?",
        "आपकी जन्म तिथि क्या है?",
        "आपका आधार नंबर क्या है?",
        "आपका पता क्या है?",
      ],

      "College Admission": [
        "आपका पूरा नाम क्या है?",
        "आपका इंटरमीडिएट प्रतिशत कितना है?",
        "आप कौन सा कोर्स करना चाहते हैं?",
        "आपका फोन नंबर क्या है?",
      ],

      Scholarship: [
        "आपका पूरा नाम क्या है?",
        "आपके परिवार की वार्षिक आय कितनी है?",
        "आप किस कॉलेज में पढ़ते हैं?",
        "आपका बैंक खाता नंबर क्या है?",
      ],

      "Hospital Registration": [
        "आपका पूरा नाम क्या है?",
        "आपकी उम्र कितनी है?",
        "आपका ब्लड ग्रुप क्या है?",
        "आपको क्या लक्षण हैं?",
      ],

      "Job Application": [
        "आपका पूरा नाम क्या है?",
        "आपकी शैक्षणिक योग्यता क्या है?",
        "आपके पास कितने वर्षों का कार्य अनुभव है?",
        "आपका ईमेल पता क्या है?",
      ],
    },
  };

  // =========================================================
  // UI MESSAGES
  // =========================================================

  const messages = {
    English: {
      start: "Click Start Voice Assistant to begin.",
      listening: "🎤 Listening...",
      noSpeech:
        "Sorry, I didn't hear anything. Please say your answer again.",
      microphone:
        "Microphone not detected. Please check your microphone.",
      permission:
        "Microphone permission denied.",
      understand:
        "I couldn't understand. Please repeat.",
      completed:
        "Congratulations! You have completed the form.",
      saved:
        "✅ Form Completed Successfully!",
      login:
        "Your login session was not found. Please login again.",
      saveError:
        "❌ Unable to save the form. Please make sure the backend is running.",
      browser:
        "Speech Recognition is not supported in this browser.",
    },

    Telugu: {
      start:
        "వాయిస్ అసిస్టెంట్ ప్రారంభించడానికి క్లిక్ చేయండి.",
      listening:
        "🎤 వింటున్నాను...",
      noSpeech:
        "క్షమించండి, మీ సమాధానం వినిపించలేదు. దయచేసి మళ్లీ చెప్పండి.",
      microphone:
        "మైక్రోఫోన్ కనుగొనబడలేదు. దయచేసి మీ మైక్రోఫోన్‌ను తనిఖీ చేయండి.",
      permission:
        "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది.",
      understand:
        "మీ సమాధానం అర్థం కాలేదు. దయచేసి మళ్లీ చెప్పండి.",
      completed:
        "అభినందనలు! మీరు ఫారమ్‌ను పూర్తి చేశారు.",
      saved:
        "✅ ఫారమ్ విజయవంతంగా పూర్తయింది!",
      login:
        "మీ లాగిన్ సెషన్ కనుగొనబడలేదు. దయచేసి మళ్లీ లాగిన్ చేయండి.",
      saveError:
        "❌ ఫారమ్‌ను సేవ్ చేయలేకపోయాము. దయచేసి బ్యాకెండ్ నడుస్తుందో చూడండి.",
      browser:
        "ఈ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్‌కు మద్దతు లేదు.",
    },

    Hindi: {
      start:
        "वॉइस असिस्टेंट शुरू करने के लिए क्लिक करें।",
      listening:
        "🎤 सुन रहा हूँ...",
      noSpeech:
        "माफ़ कीजिए, आपकी आवाज़ सुनाई नहीं दी। कृपया अपना उत्तर फिर से बोलें।",
      microphone:
        "माइक्रोफ़ोन नहीं मिला। कृपया अपना माइक्रोफ़ोन जाँचें।",
      permission:
        "माइक्रोफ़ोन की अनुमति नहीं है।",
      understand:
        "मैं आपका उत्तर समझ नहीं पाया। कृपया फिर से बोलें।",
      completed:
        "बधाई हो! आपने फॉर्म पूरा कर लिया है।",
      saved:
        "✅ फॉर्म सफलतापूर्वक पूरा हो गया!",
      login:
        "आपका लॉगिन सत्र नहीं मिला। कृपया फिर से लॉगिन करें।",
      saveError:
        "❌ फॉर्म सेव नहीं हो सका। कृपया सुनिश्चित करें कि बैकएंड चल रहा है।",
      browser:
        "इस ब्राउज़र में स्पीच रिकग्निशन उपलब्ध नहीं है।",
    },
  };

  const currentMessages =
    messages[selectedLanguage] ||
    messages.English;

  // =========================================================
  // LOGIN CHECK
  // =========================================================

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // =========================================================
  // PROGRESS
  // =========================================================

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) /
          questions.length) *
        100
      : 0;

  // =========================================================
  // GET TRANSLATED QUESTIONS
  // =========================================================

  const getQuestionsForLanguage = (
    englishQuestions
  ) => {
    // English
    if (selectedLanguage === "English") {
      return englishQuestions;
    }

    // Telugu
    if (
      selectedLanguage === "Telugu" &&
      translations.Telugu[form]
    ) {
      return translations.Telugu[form];
    }

    // Hindi
    if (
      selectedLanguage === "Hindi" &&
      translations.Hindi[form]
    ) {
      return translations.Hindi[form];
    }

    // Fallback
    return englishQuestions;
  };

  // =========================================================
  // SPEAK TEXT
  // =========================================================

  const speakText = (
    text,
    listenAfter = false
  ) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = language.code;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    if (listenAfter) {
      utterance.onend = () => {
        startListening();
      };
    }

    window.speechSynthesis.speak(
      utterance
    );
  };

  // =========================================================
  // SPEAK CURRENT QUESTION
  // =========================================================

  const speakQuestion = (text) => {
    speakText(text, true);
  };

  // =========================================================
  // FETCH QUESTIONS
  // =========================================================

  useEffect(() => {
    setLoading(true);

    axios
  .get(
    `${API_BASE_URL}/questions/${encodeURIComponent(
      form
    )}`
   )
      .then((response) => {
        const englishQuestions =
          response.data.questions || [];

        const translatedQuestions =
          getQuestionsForLanguage(
            englishQuestions
          );

        setQuestions(
          translatedQuestions
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error loading questions:",
          error
        );

        setQuestions([]);
        setLoading(false);
      });
  }, [form, selectedLanguage]);

  // =========================================================
  // SPEAK NEXT QUESTION
  // =========================================================

  useEffect(() => {
    if (
      questions.length > 0 &&
      currentQuestion > 0
    ) {
      speakQuestion(
        questions[currentQuestion]
      );
    }
  }, [currentQuestion, questions]);

  // =========================================================
  // START LISTENING
  // =========================================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(currentMessages.browser);
      return;
    }

    const recognition =
      new SpeechRecognition();

    // IMPORTANT:
    // Recognition language changes based
    // on selected language.
    recognition.lang = language.code;

    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    setSpeech(
      currentMessages.listening
    );

    // =======================================================
    // SPEECH RESULT
    // =======================================================

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0]
          .transcript
          .trim();

      // -----------------------------------------------------
      // EMPTY ANSWER
      // -----------------------------------------------------

      if (!transcript) {
        setSpeech(
          currentMessages.noSpeech
        );

        speakText(
          currentMessages.noSpeech,
          true
        );

        return;
      }

      // -----------------------------------------------------
      // SHOW ANSWER
      // -----------------------------------------------------

      setSpeech(transcript);

      // -----------------------------------------------------
      // SAVE ANSWER
      // -----------------------------------------------------

      const updatedAnswers = {
        ...answers,
        [questions[currentQuestion]]:
          transcript,
      };

      setAnswers(updatedAnswers);

      // -----------------------------------------------------
      // NEXT QUESTION
      // -----------------------------------------------------

      if (
        currentQuestion <
        questions.length - 1
      ) {
        setCurrentQuestion(
          (prev) => prev + 1
        );
      }

      // -----------------------------------------------------
      // FINAL QUESTION
      // -----------------------------------------------------

      else {
        submitForm(
          updatedAnswers
        );
      }
    };

    // =======================================================
    // SPEECH ERROR
    // =======================================================

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      let message =
        currentMessages.understand;

      if (
        event.error === "no-speech"
      ) {
        message =
          currentMessages.noSpeech;
      } else if (
        event.error === "audio-capture"
      ) {
        message =
          currentMessages.microphone;
      } else if (
        event.error === "not-allowed"
      ) {
        message =
          currentMessages.permission;
      }

      setSpeech(message);

      speakText(
        message,
        event.error !==
          "audio-capture" &&
          event.error !==
            "not-allowed"
      );
    };
  };

  // =========================================================
  // SUBMIT FORM
  // =========================================================

  const submitForm = async (
    finalAnswers
  ) => {
    try {
      const currentUser =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (!currentUser) {
        alert(
          currentMessages.login
        );

        navigate("/login");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/submit`,
        {
          form: form,
          answers: finalAnswers,
          user_email:
            currentUser.email,
        }
      );

      console.log(
        "Form saved successfully!"
      );

      setCompleted(true);

      window.speechSynthesis.cancel();

      const message =
        currentMessages.completed;

      const utterance =
        new SpeechSynthesisUtterance(
          message
        );

      utterance.lang =
        language.code;

      window.speechSynthesis.speak(
        utterance
      );

      alert(
        currentMessages.saved
      );

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error saving form:",
        error
      );

      alert(
        currentMessages.saveError
      );
    }
  };

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

  const downloadPDF = () => {
    const doc = new jsPDF();

    // -------------------------------------------------------
    // HEADER
    // -------------------------------------------------------

    doc.setFontSize(20);

    doc.text(
      "VoiceForm AI",
      20,
      20
    );

    doc.setFontSize(16);

    doc.text(
      `${form} Form`,
      20,
      35
    );

    doc.setFontSize(12);

    let y = 50;

    // -------------------------------------------------------
    // USER INFORMATION
    // -------------------------------------------------------

    const currentUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (currentUser) {
      doc.text(
        `Name: ${currentUser.name}`,
        20,
        y
      );

      y += 7;

      doc.text(
        `Email: ${currentUser.email}`,
        20,
        y
      );

      y += 7;
    }

    doc.text(
      `Language: ${selectedLanguage}`,
      20,
      y
    );

    y += 12;

    // -------------------------------------------------------
    // ANSWERS
    // -------------------------------------------------------

    Object.entries(answers).forEach(
      ([question, answer], index) => {
        // Question
        const questionLines =
          doc.splitTextToSize(
            `${index + 1}. ${question}`,
            165
          );

        doc.text(
          questionLines,
          20,
          y
        );

        y +=
          questionLines.length * 6;

        // Answer
        const answerLines =
          doc.splitTextToSize(
            `Answer: ${answer}`,
            160
          );

        doc.text(
          answerLines,
          25,
          y
        );

        y +=
          answerLines.length * 6;

        y += 8;

        // New page
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }
    );

    // -------------------------------------------------------
    // SAVE
    // -------------------------------------------------------

    doc.save(
      `${form}_Form.pdf`
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="voice-page">
        <h2>
          Loading questions...
        </h2>
      </div>
    );
  }

  // =========================================================
  // NO QUESTIONS
  // =========================================================

  if (questions.length === 0) {
    return (
      <div className="voice-page">
        <h2>
          No questions found for "{form}"
        </h2>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="voice-page">

      {/* =====================================================
          TITLE
      ===================================================== */}

      <h1>
        🎤 VoiceForm AI
      </h1>

      <h2>
        {form}
      </h2>

      {/* =====================================================
          SELECTED LANGUAGE
      ===================================================== */}

      <p>
        <strong>
          Language:
        </strong>{" "}
        {language.name}
      </p>

      {/* =====================================================
          PROGRESS BAR
      ===================================================== */}

      <div className="progress-container">

        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <p>
        {Math.round(progress)}%
        {" "}Completed
      </p>

      {/* =====================================================
          QUESTION NUMBER
      ===================================================== */}

      <p>
        Question{" "}
        {currentQuestion + 1}{" "}
        of{" "}
        {questions.length}
      </p>

      {/* =====================================================
          CURRENT QUESTION
      ===================================================== */}

      <h3>
        {questions[currentQuestion]}
      </h3>

      {/* =====================================================
          VOICE BUTTON
      ===================================================== */}

      <button
        className="mic-button"
        onClick={() =>
          speakQuestion(
            questions[currentQuestion]
          )
        }
        disabled={completed}
      >
        🎤 Start Voice Assistant
      </button>

      {/* =====================================================
          ANSWER
      ===================================================== */}

      <div className="speech-box">

        <strong>
          Your Answer:
        </strong>

        <br />

        {speech}

      </div>

      {/* =====================================================
          COLLECTED ANSWERS
      ===================================================== */}

      <h3>
        Collected Answers
      </h3>

      <pre>
        {JSON.stringify(
          answers,
          null,
          2
        )}
      </pre>

      {/* =====================================================
          PDF BUTTON
      ===================================================== */}

      {completed && (
        <button
          className="pdf-button"
          onClick={downloadPDF}
        >
          📄 Download PDF
        </button>
      )}

    </div>
  );
}

export default VoiceAssistant;