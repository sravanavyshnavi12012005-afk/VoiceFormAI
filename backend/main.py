from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Route
@app.get("/")
def home():
    return {
        "message": "VoiceForm AI Backend Running 🚀"
    }

# Questions for different forms
questions = {
    "Passport": [
        "What is your full name?",
        "What is your date of birth?",
        "What is your Aadhaar number?",
        "What is your address?"
    ],

    "College Admission": [
        "What is your full name?",
        "What is your intermediate percentage?",
        "Which course do you want to join?",
        "What is your phone number?"
    ],

    "Scholarship": [
        "What is your full name?",
        "What is your family income?",
        "Which college do you study in?",
        "What is your bank account number?"
    ],

    "Hospital Registration": [
        "What is your full name?",
        "What is your age?",
        "What is your blood group?",
        "What is your mobile number?"
    ],

    "Job Application": [
        "What is your full name?",
        "What is your highest qualification?",
        "How many years of experience do you have?",
        "What is your email address?"
    ]
}

# Get questions based on selected form
@app.get("/questions/{form_name}")
def get_questions(form_name: str):
    return {
        "form": form_name,
        "questions": questions.get(form_name, [])
    }