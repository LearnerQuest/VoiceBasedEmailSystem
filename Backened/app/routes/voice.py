import os
import uuid
from fastapi import APIRouter, UploadFile, File
from app.services.transcribe import transcribe_audio

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1] if "." in file.filename else "webm"
    temp_filename = f"{uuid.uuid4()}.{ext}"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)

    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())

    transcript = transcribe_audio(temp_path)

    try:
        os.remove(temp_path)
    except Exception:
        pass

    return {"transcript": transcript}