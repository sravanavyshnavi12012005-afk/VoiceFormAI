from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader

import sqlite3
import os
import uuid
import json

app = FastAPI()


# =========================================================
# DATABASE
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "voiceform.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = get_db()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    """)

    # Form submissions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS form_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            form TEXT NOT NULL,
            answers TEXT NOT NULL,
            user_email TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


create_tables()


# =========================================================
# UPLOAD FOLDER
# =========================================================

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploaded_forms")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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

    conn = get_db()
    cursor = conn.cursor()

    # Check whether email already exists
    cursor.execute(
        "SELECT id FROM users WHERE LOWER(email) = LOWER(?)",
        (data.email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Insert new user
    cursor.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        """,
        (
            data.name,
            data.email,
            data.password
        )
    )

    conn.commit()
    conn.close()

    return {
        "message": "Registration successful!"
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login_user(data: UserLogin):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT name, email, password
        FROM users
        WHERE LOWER(email) = LOWER(?)
        """,
        (data.email,)
    )

    user = cursor.fetchone()

    conn.close()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if user["password"] != data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    return {
        "message": "Login successful!",
        "name": user["name"],
        "email": user["email"],
    }


# =========================================================
# SUBMIT FORM
# =========================================================

@app.post("/submit")
def submit_form(data: FormSubmission):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO form_submissions
        (form, answers, user_email)
        VALUES (?, ?, ?)
        """,
        (
            data.form,
            json.dumps(data.answers),
            data.user_email
        )
    )

    conn.commit()
    conn.close()

    return {
        "message": "Form Saved Successfully"
    }


# =========================================================
# GET USER SUBMISSIONS
# =========================================================

@app.get("/submissions/{user_email}")
def get_user_submissions(user_email: str):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, form, answers, user_email
        FROM form_submissions
        WHERE LOWER(user_email) = LOWER(?)
        ORDER BY id ASC
        """,
        (user_email,)
    )

    rows = cursor.fetchall()

    conn.close()

    submissions = []

    for row in rows:

        submissions.append({
            "id": row["id"],
            "form": row["form"],
            "answers": json.loads(row["answers"]),
            "user_email": row["user_email"]
        })

    return submissions


# =========================================================
# UPLOAD PDF FORM
# =========================================================

# =========================================================
# UPLOAD PDF FORM
# =========================================================

@app.post("/upload-form")
async def upload_form(file: UploadFile = File(...)):

    # Check file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    try:
        # Create a unique filename
        unique_name = f"{uuid.uuid4().hex}_{file.filename}"

        # Complete path where PDF will actually be stored
        file_path = os.path.join(
            UPLOAD_FOLDER,
            unique_name
        )

        # Save uploaded file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        return {
            "message": "Form uploaded successfully!",
            "original_file_name": file.filename,
            "file_name": unique_name,
            "file_path": file_path
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to upload form: {str(e)}"
        )
# =========================================================
# READ UPLOADED PDF
# =========================================================

# =========================================================
# READ UPLOADED PDF
# =========================================================

@app.get("/read-form/{file_name:path}")
def read_uploaded_form(file_name: str):

    # Keep only the filename
    requested_name = os.path.basename(file_name)

    # -----------------------------------------------------
    # 1. Try exact filename first
    # -----------------------------------------------------

    exact_path = os.path.join(
        UPLOAD_FOLDER,
        requested_name
    )

    actual_file_path = None

    if os.path.isfile(exact_path):
        actual_file_path = exact_path

    # -----------------------------------------------------
    # 2. If exact filename doesn't exist,
    #    search for UUID_originalfilename.pdf
    # -----------------------------------------------------

    if actual_file_path is None:

        for saved_file in os.listdir(UPLOAD_FOLDER):

            if saved_file.endswith("_" + requested_name):

                actual_file_path = os.path.join(
                    UPLOAD_FOLDER,
                    saved_file
                )

                break

    # -----------------------------------------------------
    # 3. Still not found
    # -----------------------------------------------------

    if actual_file_path is None:

        raise HTTPException(
            status_code=404,
            detail=f"Uploaded form not found: {requested_name}"
        )

    # -----------------------------------------------------
    # 4. Extract PDF text
    # -----------------------------------------------------

    try:

        reader = PdfReader(actual_file_path)

        extracted_text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + "\n"

        return {
            "file_name": os.path.basename(actual_file_path),
            "text": extracted_text
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to read PDF: {str(e)}"
        )
# =========================================================
# ANALYZE UPLOADED FORM
# =========================================================

# =========================================================
# ANALYZE UPLOADED FORM
# =========================================================

@app.get("/analyze-form/{file_name:path}")
def analyze_uploaded_form(file_name: str):

    requested_name = os.path.basename(file_name)

    # Find exact file
    exact_path = os.path.join(
        UPLOAD_FOLDER,
        requested_name
    )

    actual_file_path = None

    if os.path.isfile(exact_path):
        actual_file_path = exact_path

    # Find UUID_original_filename
    if actual_file_path is None:

        for saved_file in os.listdir(UPLOAD_FOLDER):

            if saved_file.endswith("_" + requested_name):

                actual_file_path = os.path.join(
                    UPLOAD_FOLDER,
                    saved_file
                )

                break

    if actual_file_path is None:

        raise HTTPException(
            status_code=404,
            detail="Uploaded form not found."
        )

    try:

        # -------------------------------------------------
        # READ PDF
        # -------------------------------------------------

        reader = PdfReader(actual_file_path)

        extracted_text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + "\n"

        # -------------------------------------------------
        # DETECT FORM FIELDS
        # -------------------------------------------------

        field_patterns = [

            ("Full Name", "What is your full name?"),

            ("Grade / Course Applying For",
             "Which grade or course are you applying for?"),

            ("Date of Birth",
             "What is your date of birth?"),

            ("Gender",
             "What is your gender?"),

            ("Nationality",
             "What is your nationality?"),

            ("Blood Group",
             "What is your blood group?"),

            ("Aadhaar / National Identity No.",
             "What is your Aadhaar or national identity number?"),

            ("Category / Religion",
             "What is your category or religion?"),

            ("Residential Address",
             "What is your residential address?"),

            ("City",
             "Which city do you live in?"),

            ("State / Province",
             "Which state or province do you live in?"),

            ("ZIP / Postal Code",
             "What is your ZIP or postal code?"),

            ("Mobile Number",
             "What is your mobile number?"),

            ("Email Address",
             "What is your email address?"),

            ("Father / Guardian 1 Name",
             "What is your father or guardian's name?"),

            ("Mother / Guardian 2 Name",
             "What is your mother or guardian's name?"),

            ("Occupation & Designation",
             "What is your parent's occupation and designation?"),

            ("Previous School / College Attended",
             "What school or college did you attend previously?"),

            ("Grade / Degree",
             "What grade or degree did you complete?"),

            ("Completed Year",
             "What year did you complete it?"),

            ("Marks / GPA",
             "What marks or GPA did you obtain?")
        ]

        detected_fields = []
        questions_detected = []

        text_lower = extracted_text.lower()

        for field_name, question in field_patterns:

            # Search for important words instead of requiring
            # exact formatting from the PDF
            keywords = field_name.lower().split("/")

            matched = False

            for keyword_group in keywords:

                keyword_group = keyword_group.strip()

                if keyword_group and keyword_group in text_lower:
                    matched = True
                    break

            if matched:

                if field_name not in detected_fields:

                    detected_fields.append(
                        field_name
                    )

                    questions_detected.append(
                        question
                    )

        return {
            "file_name": os.path.basename(
                actual_file_path
            ),

            "extracted_text": extracted_text,

            "detected_fields": detected_fields,

            "questions": questions_detected
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to analyze PDF: {str(e)}"
        )
# =========================================================
# DOWNLOAD COMPLETED PDF
# =========================================================

@app.get("/download/{file_name:path}")
def download_pdf(file_name: str):

    from fastapi.responses import FileResponse

    requested_name = os.path.basename(file_name)

    file_path = os.path.join(
        UPLOAD_FOLDER,
        requested_name
    )

    if not os.path.isfile(file_path):

        raise HTTPException(
            status_code=404,
            detail="PDF file not found."
        )

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=requested_name
    )