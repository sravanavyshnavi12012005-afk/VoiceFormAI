from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Questions
# ==============================

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
        "Which course do you want?",
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
        "What symptoms do you have?"
    ],

    "Job Application": [
        "What is your full name?",
        "What is your qualification?",
        "How many years of experience do you have?",
        "What is your email address?"
    ],
}

# ==============================
# Temporary Database
# ==============================

saved_forms = []

# ==============================
# Models
# ==============================

class FormSubmission(BaseModel):
    form: str
    answers: dict

# ==============================
# APIs
# ==============================

@app.get("/")
def home():
    return {
        "message": "VoiceForm AI Backend Running"
    }


@app.get("/questions/{form_name}")
def get_questions(form_name: str):
    return {
        "questions": questions.get(form_name, [])
    }


@app.post("/submit")
def submit_form(data: FormSubmission):

    saved_forms.append({
        "form": data.form,
        "answers": data.answers
    })

    return {
        "message": "Form Saved Successfully"
    }


@app.get("/submissions")
def get_submissions():
    return saved_forms