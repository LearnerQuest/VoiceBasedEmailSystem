import json
from groq import Groq
from app.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def generate_email_draft(text: str):
    prompt = f"""
You are a professional AI email writing assistant.

Transform the user's natural language instruction into a complete professional email draft.

Instruction:
{text}

Requirements:
- Extract the recipient email address if it exists.
- Create a meaningful and context-specific subject line.
- Write a proper professional email body.
- Add a formal greeting based on the context.
- Rewrite the message in polished, natural professional English.
- Maintain the user's original intent.
- Add a polite closing.
- If recipient name is not known, use a neutral greeting like "Dear Sir/Madam," or "Dear Team,".
- Keep the email concise.
- Return ONLY valid JSON.

Output format:
{{
  "to": "recipient@example.com",
  "subject": "Professional subject here",
  "body": "Dear ...\\n\\nProfessional email body here...\\n\\nRegards,\\nAashi Garg"
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a professional email writing assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )

    result = response.choices[0].message.content.strip()

    try:
        start = result.find("{")
        end = result.rfind("}") + 1
        if start != -1 and end > 0:
            result = result[start:end]
        return json.loads(result)
    except Exception:
        return {
            "to": "",
            "subject": "Draft Generation Error",
            "body": result,
        }