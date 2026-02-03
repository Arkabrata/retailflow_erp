from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import HSNMaster
from ...schemas import HSNCreate, HSNOut

router = APIRouter(prefix="/hsn", tags=["HSN Master"])

@router.get("", response_model=list[HSNOut])
def list_hsn(db: Session = Depends(get_db)):
    return db.query(HSNMaster).order_by(HSNMaster.hsn_code).all()

@router.post("", response_model=HSNOut)
def create_hsn(payload: HSNCreate, db: Session = Depends(get_db)):
    existing = db.query(HSNMaster).filter(HSNMaster.hsn_code == payload.hsn_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="HSN code already exists")

    h = HSNMaster(**payload.model_dump())
    db.add(h)
    db.commit()
    db.refresh(h)
    return h

@router.put("/{hsn_id}", response_model=HSNOut)
def update_hsn(hsn_id: int, payload: HSNCreate, db: Session = Depends(get_db)):
    h = db.query(HSNMaster).filter(HSNMaster.id == hsn_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="HSN not found")

    for k, v in payload.model_dump().items():
        setattr(h, k, v)

    db.commit()
    db.refresh(h)
    return h

@router.delete("/{hsn_id}")
def delete_hsn(hsn_id: int, db: Session = Depends(get_db)):
    h = db.query(HSNMaster).filter(HSNMaster.id == hsn_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="HSN not found")
    db.delete(h)
    db.commit()
    return {"ok": True}