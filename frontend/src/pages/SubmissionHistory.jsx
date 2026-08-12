import { useEffect, useState } from "react";
import axios from "axios";
import "./SubmissionHistory.css";

function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/submissions")
      .then((response) => {
        setSubmissions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching submissions:", error);
        setError("Unable to load submission history.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="history-page">
        <h2>Loading submission history...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <h2>{error}</h2>
        <p>Make sure the FastAPI backend is running.</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>📋 Submission History</h1>
        <p>View your previously submitted forms.</p>
      </div>

      {submissions.length === 0 ? (
        <div className="no-submissions">
          <div className="empty-icon">📂</div>
          <h2>No submissions yet</h2>
          <p>
            Complete a form using VoiceForm AI and your submission
            will appear here.
          </p>
        </div>
      ) : (
        <div className="submission-list">
          {submissions.map((submission) => (
            <div className="submission-card" key={submission.id}>
              <div className="submission-top">
                <div>
                  <h2>{submission.form}</h2>
                  <p>Submission ID: {submission.id}</p>
                </div>

                <span className="saved-badge">
                  ✓ Saved
                </span>
              </div>

              <div className="answers-section">
                <h3>📝 Answers</h3>

                {Object.entries(submission.answers).map(
                  ([question, answer]) => (
                    <div className="answer-row" key={question}>
                      <p className="question">
                        {question}
                      </p>

                      <p className="answer">
                        {answer}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubmissionHistory;