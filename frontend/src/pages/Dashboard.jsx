import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CHECK LOGIN + LOAD USER SUBMISSIONS
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    setUser(loggedInUser);

    axios
      .get(
        `http://127.0.0.1:8000/submissions/${encodeURIComponent(
          loggedInUser.email
        )}`
      )
      .then((response) => {
        console.log("User submissions:", response.data);

        setSubmissions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error loading submissions:",
          error
        );

        setSubmissions([]);
        setLoading(false);
      });
  }, [navigate]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        {/* HEADER */}

        <h1>🎤 VoiceForm AI</h1>

        <h2>Welcome to your Dashboard</h2>

        {user && (
          <p className="welcome-text">
            Welcome,{" "}
            <strong>
              {user.name || user.email}
            </strong>{" "}
           ! 👋
          </p>
        )}

        <p className="dashboard-subtitle">
          Complete forms quickly and easily using your
          voice.
        </p>

        {/* STATISTICS */}

        <div className="dashboard-stats">

          <div className="stat-card">
            <span>📝</span>
            <h3>{submissions.length}</h3>
            <p>Forms Completed</p>
          </div>

          <div className="stat-card">
            <span>🎤</span>
            <h3>Voice</h3>
            <p>Easy Form Filling</p>
          </div>

          <div className="stat-card">
            <span>📄</span>
            <h3>PDF</h3>
            <p>Download Forms</p>
          </div>

        </div>

        {/* MAIN OPTIONS */}

        <h2 className="section-title">
          What would you like to do?
        </h2>

        <div className="dashboard-buttons">

          {/* FILL FORM */}

          <Link
            to="/forms"
            className="dashboard-card"
          >
            <span>📝</span>

            <h3>Fill a Form</h3>

            <p>
              Complete government, college,
              hospital and other forms using
              your voice.
            </p>

            <strong>
              Start Now →
            </strong>
          </Link>

          {/* HISTORY */}

          <Link
            to="/history"
            className="dashboard-card"
          >
            <span>📋</span>

            <h3>Form History</h3>

            <p>
              View your previously submitted
              forms and saved answers.
            </p>

            <strong>
              View History →
            </strong>
          </Link>

        </div>

        {/* RECENT SUBMISSIONS */}

        <div className="recent-section">

          <div className="recent-header">

            <h2>🕘 Recent Submissions</h2>

            <Link to="/history">
              View All
            </Link>

          </div>

          {/* LOADING */}

          {loading && (
            <p className="loading-text">
              Loading submissions...
            </p>
          )}

          {/* NO SUBMISSIONS */}

          {!loading &&
            submissions.length === 0 && (
              <div className="empty-submissions">

                <span>📄</span>

                <h3>
                  No submissions yet
                </h3>

                <p>
                  Complete your first voice form
                  to see it here.
                </p>

                <Link
                  to="/forms"
                  className="start-form-button"
                >
                  🎤 Start Your First Form
                </Link>

              </div>
            )}

          {/* SUBMISSIONS */}

          {!loading &&
            submissions.length > 0 && (
              <div className="recent-list">

                {submissions
                  .slice(-3)
                  .reverse()
                  .map((submission, index) => (

                    <div
                      className="recent-item"
                      key={index}
                    >

                      <div className="recent-icon">
                        📝
                      </div>

                      <div className="recent-info">

                        <h3>
                          {submission.form}
                        </h3>

                        <p>
                          ✓ Form completed
                          successfully
                        </p>

                      </div>

                      <span className="completed-badge">
                        Completed
                      </span>

                    </div>

                  ))}

              </div>
            )}

        </div>

        {/* LOGOUT */}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default Dashboard;