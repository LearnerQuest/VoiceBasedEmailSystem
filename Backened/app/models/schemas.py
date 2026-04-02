from pydantic import BaseModel, EmailStr

class EmailRequest(BaseModel):
    transcript: str

class EmailDraft(BaseModel):
    to: EmailStr
    subject: str
    body: str