from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# FORM QUESTIONS
# =========================================================

questions = {
    "Passport": [
        "What is your full name?",
        "What is your date of birth?",
        "What is your Aadhaar number?",
        "What is your address?",
    ],

    "College Admission": [
        "What is your full name?",
        "What is your intermediate percentage?",
        "Which course do you want?",
        "What is your phone number?",
    ],

    "Scholarship": [
        "What is your full name?",
        "What is your family income?",
        "Which college do you study in?",
        "What is your bank account number?",
    ],

    "Hospital Registration": [
        "What is your full name?",
        "What is your age?",
        "What is your blood group?",
        "What symptoms do you have?",
    ],

    "Job Application": [
        "What is your full name?",
        "What is your qualification?",
        "How many years of experience do you have?",
        "What is your email address?",
    ],
}


# =========================================================
# TEMPORARY STORAGE
# =========================================================

users = []
saved_forms = []


# =========================================================
# MODELS
# =========================================================

class UserRegistration(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class FormSubmission(BaseModel):
    form: str
    answers: dict
    user_email: str


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "VoiceForm AI Backend Running"
    }


# =========================================================
# GET QUESTIONS
# =========================================================

@app.get("/questions/{form_name}")
def get_questions(form_name: str):

    return {
        "questions": questions.get(form_name, [])
    }


# =========================================================
# REGISTER
# =========================================================

@app.post("/register")
def register_user(data: UserRegistration):

    for user in users:

        if user["email"].lower() == data.email.lower():

            raise HTTPException(
                status_code=400,
                detail="Email already registered."
            )

    new_user = {
        "name": data.name,
        "email": data.email,
        "password": data.password,
    }

    users.append(new_user)

    return {
        "message": "Registration successful!"
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login_user(data: UserLogin):

    for user in users:

        if (
            user["email"].lower() == data.email.lower()
            and user["password"] == data.password
        ):

            return {
                "message": "Login successful!",
                "name": user["name"],
                "email": user["email"],
            }

    raise HTTPException(
        status_code=401,
        detail="Invalid email or password."
    )


# =========================================================
# SUBMIT FORM
# =========================================================

@app.post("/submit")
def submit_form(data: FormSubmission):

    saved_forms.append(
        {
            "form": data.form,
            "answers": data.answers,
            "user_email": data.user_email,
        }
    )

    return {
        "message": "Form Saved Successfully"
    }


# =========================================================
# GET USER SUBMISSIONS
# =========================================================

@app.get("/submissions/{user_email}")
def get_user_submissions(user_email: str):

    user_submissions = [
        submission
        for submission in saved_forms
        if submission["user_email"].lower() == user_email.lower()
    ]

    return user_submissions