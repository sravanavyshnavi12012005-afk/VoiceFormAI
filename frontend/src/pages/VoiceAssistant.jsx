import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./VoiceAssistant.css";

function VoiceAssistant() {
  const location = useLocation();

  const form = location.state?.form || "Passport";

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [speech, setSpeech] = useState(
    "Click Start Voice Assistant to begin."
  );
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Progress Percentage
  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) / questions.length) * 100
      : 0;

  // ===========================
  // Speak Question
  // ===========================
  const speakQuestion = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      startListening();
    };

    window.speechSynthesis.speak(utterance);
  };

  // ===========================
  // Fetch Questions
  // ===========================
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/questions/${encodeURIComponent(form)}`)
      .then((response) => {
        setQuestions(response.data.questions);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [form]);

  // ===========================
  // Speak Next Question
  // ===========================
  useEffect(() => {
    if (questions.length > 0 && currentQuestion !== 0) {
      speakQuestion(questions[currentQuestion]);
    }
  }, [currentQuestion]);

  // ===========================
  // Speech Recognition
  // ===========================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();

    setSpeech("🎤 Listening...");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();

      if (!transcript) {
        const message =
          "Sorry, I didn't catch that. Please repeat your answer.";

        setSpeech(message);

        const utterance = new SpeechSynthesisUtterance(message);

        utterance.lang = "en-IN";

        utterance.onend = () => {
          startListening();
        };

        window.speechSynthesis.speak(utterance);

        return;
      }

      setSpeech(transcript);

      const updatedAnswers = {
        ...answers,
        [questions[currentQuestion]]: transcript,
      };

      setAnswers(updatedAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        axios
          .post("http://127.0.0.1:8000/submit", {
            form: form,
            answers: updatedAnswers,
          })
          .then(() => {
            console.log("Form saved successfully!");
          })
          .catch((error) => {
            console.error("Error saving form:", error);
          });

        window.speechSynthesis.speak(
          new SpeechSynthesisUtterance(
            "Congratulations! You have completed the form."
          )
        );

        alert("✅ Form Completed!");
        setCompleted(true);
      }
    };

    recognition.onerror = (event) => {
      let message = "";

      if (event.error === "no-speech") {
        message =
          "Sorry, I didn't hear anything. Please say your answer again.";
      } else if (event.error === "audio-capture") {
        message = "Microphone not detected. Please check your microphone.";
      } else if (event.error === "not-allowed") {
        message = "Microphone permission denied.";
      } else {
        message = "I couldn't understand. Please repeat your answer.";
      }

      setSpeech(message);

      const utterance = new SpeechSynthesisUtterance(message);

      utterance.lang = "en-IN";

      utterance.onend = () => {
        if (
          event.error !== "audio-capture" &&
          event.error !== "not-allowed"
        ) {
          startListening();
        }
      };

      window.speechSynthesis.speak(utterance);
    };
  };

  // ===========================
  // Download PDF
  // ===========================
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("VoiceForm AI", 20, 20);

    doc.setFontSize(16);
    doc.text(`${form} Form`, 20, 35);

    doc.setFontSize(12);

    let y = 50;

    Object.entries(answers).forEach(([question, answer], index) => {
      doc.text(`${index + 1}. ${question}`, 20, y);
      y += 8;

      doc.text(`Answer: ${answer}`, 25, y);
      y += 15;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${form}_Form.pdf`);
  };

  // ===========================
  // Loading
  // ===========================
  if (loading) {
    return (
      <div className="voice-page">
        <h2>Loading questions...</h2>
      </div>
    );
  }

  // ===========================
  // No Questions
  // ===========================
  if (questions.length === 0) {
    return (
      <div className="voice-page">
        <h2>No questions found for "{form}"</h2>
      </div>
    );
  }

  return (
    <div className="voice-page">
      <h1>🎤 VoiceForm AI</h1>

      <h2>{form}</h2>

      {/* Progress Bar */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p>{Math.round(progress)}% Completed</p>

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <h3>{questions[currentQuestion]}</h3>

      <button
        className="mic-button"
        onClick={() => speakQuestion(questions[currentQuestion])}
      >
        🎤 Start Voice Assistant
      </button>

      <div className="speech-box">
        <strong>Your Answer:</strong>
        <br />
        {speech}
      </div>

      <h3>Collected Answers</h3>

      <pre>{JSON.stringify(answers, null, 2)}</pre>

      {completed && (
        <button className="pdf-button" onClick={downloadPDF}>
          📄 Download PDF
        </button>
      )}
    </div>
  );
}

export default VoiceAssistant;