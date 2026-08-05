import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./VoiceAssistant.css";

function VoiceAssistant() {
  const location = useLocation();

  // Selected form
  const form = location.state?.form || "Passport";

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [speech, setSpeech] = useState(
    "Click the microphone and answer using your voice."
  );
  const [loading, setLoading] = useState(true);

  // ==============================
  // Text-to-Speech Function
  // ==============================
  const speakQuestion = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // ==============================
  // Fetch Questions
  // ==============================
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/questions/${encodeURIComponent(form)}`)
      .then((response) => {
        setQuestions(response.data.questions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  }, [form]);

  // ==============================
  // Speak whenever question changes
  // ==============================
  useEffect(() => {
    if (questions.length > 0) {
      speakQuestion(questions[currentQuestion]);
    }
  }, [questions, currentQuestion]);

  // ==============================
  // Speech Recognition
  // ==============================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();

    setSpeech("🎤 Listening...");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setSpeech(transcript);

      const updatedAnswers = {
        ...answers,
        [questions[currentQuestion]]: transcript,
      };

      setAnswers(updatedAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        window.speechSynthesis.speak(
          new SpeechSynthesisUtterance(
            "Congratulations! You have completed the form."
          )
        );

        alert("✅ Form Completed!");

        console.log(updatedAnswers);
      }
    };

    recognition.onerror = () => {
      setSpeech("❌ Could not recognize your voice. Please try again.");
    };
  };

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return (
      <div className="voice-page">
        <h2>Loading questions...</h2>
      </div>
    );
  }

  // ==============================
  // No Questions
  // ==============================
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

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <h3>{questions[currentQuestion]}</h3>

      <button className="mic-button" onClick={startListening}>
        🎤 Speak Answer
      </button>

      <div className="speech-box">
        <strong>Your Answer:</strong>
        <br />
        {speech}
      </div>

      <h3>Collected Answers</h3>

      <pre>{JSON.stringify(answers, null, 2)}</pre>
    </div>
  );
}

export default VoiceAssistant;