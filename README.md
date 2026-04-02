# 🎙️ VoxMail AI – Voice & Text Based Email Automation System

VoxMail AI is an AI-powered email automation system that allows users to compose and send emails using either **voice input** or **text instructions**.  
The system converts voice to text using **Whisper**, generates a professional email draft using **Groq LLM**, and sends the final email through **Gmail SMTP**.

---

## ✨ Features

- 🎤 Voice-to-text email drafting using Whisper
- ⌨️ Text-based email instruction input
- 🤖 AI-generated professional email subject and body using Groq
- 📧 Gmail SMTP integration for sending emails
- 🖥️ Clean frontend using HTML, CSS, and JavaScript
- ⚡ FastAPI backend with API documentation via Swagger
- 🔄 End-to-end workflow: Input → Draft → Review → Send

---

## 🧠 Project Overview

This project is designed to simplify email writing and improve accessibility by allowing users to generate complete email drafts from natural language instructions.

### Example input:
> Send an email to aashigarg825@gmail.com saying I will attend the meeting tomorrow at 10 AM.

### Example output:
- **To:** aashigarg825@gmail.com
- **Subject:** Confirmation of Attendance for Tomorrow's Meeting
- **Body:** A complete professional email draft generated automatically

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- FastAPI
- Uvicorn

### AI / ML
- Whisper (speech-to-text)
- Groq API (LLM-based email drafting)

### Email Service
- Gmail SMTP
- App Password Authentication

---

## 🏗️ Project Architecture

```text
Frontend (HTML/CSS/JS)
   ↓
FastAPI Backend
   ├── Voice Transcription (Whisper)
   ├── Email Draft Generation (Groq LLM)
   └── Email Sending (Gmail SMTP)