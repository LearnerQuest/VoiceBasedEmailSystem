let mediaRecorder;
let audioChunks = [];
let currentMode = "voice";

const API_BASE = "http://127.0.0.1:8000";

const voiceTabBtn = document.getElementById("voiceTabBtn");
const textTabBtn = document.getElementById("textTabBtn");
const voiceSection = document.getElementById("voiceSection");
const textSection = document.getElementById("textSection");

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const generateBtn = document.getElementById("generateBtn");
const processTextBtn = document.getElementById("processTextBtn");
const sendBtn = document.getElementById("sendBtn");

const transcriptEl = document.getElementById("transcript");
const toEl = document.getElementById("to");
const subjectEl = document.getElementById("subject");
const bodyEl = document.getElementById("body");
const textPromptEl = document.getElementById("textPrompt");
const statusBox = document.getElementById("statusBox");
const backendStatus = document.getElementById("backendStatus");

voiceTabBtn.addEventListener("click", () => switchMode("voice"));
textTabBtn.addEventListener("click", () => switchMode("text"));

function switchMode(mode) {
  currentMode = mode;

  if (mode === "voice") {
    voiceSection.classList.remove("hidden");
    textSection.classList.add("hidden");
    voiceTabBtn.classList.add("active");
    textTabBtn.classList.remove("active");
  } else {
    textSection.classList.remove("hidden");
    voiceSection.classList.add("hidden");
    textTabBtn.classList.add("active");
    voiceTabBtn.classList.remove("active");
  }
}

function setStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.style.background = isError ? "#fef2f2" : "#eff6ff";
  statusBox.style.color = isError ? "#b91c1c" : "#1d4ed8";
  statusBox.style.borderColor = isError ? "#fecaca" : "#dbeafe";
}

async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/`);
    if (!res.ok) throw new Error("Backend not responding");

    backendStatus.textContent = "Backend: Connected";
    backendStatus.style.background = "#dcfce7";
    backendStatus.style.color = "#166534";
  } catch (err) {
    backendStatus.textContent = "Backend: Not Connected";
    backendStatus.style.background = "#fee2e2";
    backendStatus.style.color = "#991b1b";
    console.error("Backend check failed:", err);
  }
}

recordBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
    setStatus("Recording started...");
  } catch (error) {
    console.error("Microphone error:", error);
    setStatus("Microphone access denied or unavailable.", true);
  }
});

stopBtn.addEventListener("click", async () => {
  if (!mediaRecorder) return;

  mediaRecorder.stop();

  mediaRecorder.onstop = async () => {
    recordBtn.disabled = false;
    stopBtn.disabled = true;

    if (audioChunks.length === 0) {
      setStatus("No audio recorded.", true);
      return;
    }

    try {
      setStatus("Uploading audio for transcription...");

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch(`${API_BASE}/api/transcribe`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log("Transcribe response:", data);

      if (!response.ok) {
        setStatus(data.detail || data.error || "Transcription failed.", true);
        return;
      }

      transcriptEl.value = data.transcript || data.text || "";
      setStatus("Transcript generated successfully. Click Generate Draft.");
    } catch (error) {
      console.error("Transcribe error:", error);
      setStatus("Error while transcribing audio.", true);
    }
  };
});

processTextBtn.addEventListener("click", async () => {
  currentMode = "text";

  const textToProcess = textPromptEl.value.trim();

  if (!textToProcess) {
    setStatus("Please enter text first.", true);
    return;
  }

  // Text input itself acts as transcript
  transcriptEl.value = textToProcess;

  try {
    setStatus("Generating email draft...");

    const response = await fetch(`${API_BASE}/api/generate-draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transcript: textToProcess
      })
    });

    const data = await response.json();
    console.log("Generate Draft Response:", data);

    if (!response.ok) {
      setStatus(data.detail || data.error || "Draft generation failed.", true);
      return;
    }

    toEl.value = data.to || "";
    subjectEl.value = data.subject || "";
    bodyEl.value = data.body || "";

    setStatus("Draft generated successfully ✅");
  } catch (error) {
    console.error("Generate Draft Error:", error);
    setStatus("Error while generating draft.", true);
  }
});

generateBtn.addEventListener("click", async () => {
  try {
    const textToProcess = transcriptEl.value.trim();

    if (!textToProcess) {
      setStatus("Please record audio and generate transcript first.", true);
      return;
    }

    setStatus("Generating email draft...");

    const response = await fetch(`${API_BASE}/api/generate-draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transcript: textToProcess
      })
    });

    const data = await response.json();
    console.log("Generate Draft Response:", data);

    if (!response.ok) {
      setStatus(data.detail || data.error || "Draft generation failed.", true);
      return;
    }

    toEl.value = data.to || "";
    subjectEl.value = data.subject || "";
    bodyEl.value = data.body || "";

    setStatus("Draft generated successfully ✅");
  } catch (error) {
    console.error("Generate Draft Error:", error);
    setStatus("Error while generating draft.", true);
  }
});

sendBtn.addEventListener("click", async () => {
  try {
    const payload = {
      to: toEl.value.trim(),
      subject: subjectEl.value.trim(),
      body: bodyEl.value.trim()
    };

    if (!payload.to || !payload.subject || !payload.body) {
      setStatus("Please fill recipient, subject, and body before sending.", true);
      return;
    }

    setStatus("Sending email...");

    const response = await fetch(`${API_BASE}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Send Email Response:", data);

    if (!response.ok) {
      setStatus(data.detail || data.error || data.message || "Failed to send email.", true);
      return;
    }

    setStatus(data.message || "Email sent successfully ✅");
  } catch (error) {
    console.error("Send Email Error:", error);
    setStatus("Error while sending email.", true);
  }
});

checkBackend();