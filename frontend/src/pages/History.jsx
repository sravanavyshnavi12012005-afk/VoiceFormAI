import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./History.css";

function History() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD CURRENT USER'S HISTORY
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // User is not logged in
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    axios
      .get(
        `http://127.0.0.1:8000/submissions/${encodeURIComponent(
          user.email
        )}`
      )
      .then((response) => {
        console.log(
          "User history:",
          response.data
        );

        setSubmissions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching history:",
          error
        );

        setError(
          "Unable to load form history."
        );

        setLoading(false);
      });
  }, [navigate]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="history-page">

        <div className="history-container">

          <h2>
            📋 Loading History...
          </h2>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="history-page">

        <div className="history-container">

          <h2>
            ❌ {error}
          </h2>

          <p>
            Please make sure the VoiceForm AI
            backend is running.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="history-page">

      <div className="history-container">

        <h1>
          📋 Form History
        </h1>

        <p className="history-subtitle">
          View your previously submitted forms
          and answers.
        </p>

        {/* NO HISTORY */}

        {submissions.length === 0 ? (

          <div className="no-history">

            <div className="empty-icon">
              📄
            </div>

            <h2>
              No Forms Submitted Yet
            </h2>

            <p>
              Once you complete a form,
              it will appear here.
            </p>

          </div>

        ) : (

          /* HISTORY LIST */

          <div className="history-list">

            {submissions.map(
              (submission, index) => (

                <div
                  className="history-card"
                  key={index}
                >

                  {/* CARD HEADER */}

                  <div className="history-card-header">

                    <div>

                      <h2>
                        📝 {submission.form}
                      </h2>

                      <p>
                        Form #{index + 1}
                      </p>

                    </div>

                    <span className="completed-badge">
                      ✓ Completed
                    </span>

                  </div>

                  {/* ANSWERS */}

                  <div className="answers-section">

                    <h3>
                      📝 Submitted Answers
                    </h3>

                    {Object.entries(
                      submission.answers || {}
                    ).map(
                      (
                        [question, answer],
                        answerIndex
                      ) => (

                        <div
                          className="answer-item"
                          key={answerIndex}
                        >

                          <p className="question">

                            {answerIndex + 1}.{" "}
                            {question}

                          </p>

                          <p className="answer">

                            {answer ||
                              "No answer provided"}

                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default History;