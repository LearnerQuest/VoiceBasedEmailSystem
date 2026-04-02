from fastapi import APIRouter
from app.models.schemas import EmailRequest, EmailDraft
from app.services.parser import generate_email_draft
from app.services.gmail_service import send_email

router = APIRouter()

@router.post("/generate-draft")
def generate_draft(data: EmailRequest):
    return generate_email_draft(data.transcript)

@router.post("/send-email")
def send_email_route(data: EmailDraft):
    send_email(data.to, data.subject, data.body)
    return {
        "message": "Email sent successfully",
        "gmail_id": None
    }