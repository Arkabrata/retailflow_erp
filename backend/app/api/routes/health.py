from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
def ping():
    return {"status": "ok", "message": "RetailFlow backend is alive with SQLite DB."}