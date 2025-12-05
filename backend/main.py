from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI(title="RetailFlow API (No DB yet)")

# Allow React frontend (Vite) to call this API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple health-check endpoint
@app.get("/api/ping")
def ping():
  return {
      "status": "ok",
      "message": "RetailFlow backend is alive (no DB yet).",
  }
