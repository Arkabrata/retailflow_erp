from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import ItemMaster
from ...schemas import ItemCreate, ItemOut

router = APIRouter(prefix="/items", tags=["Item Master"])

@router.get("", response_model=list[ItemOut])
def list_items(db: Session = Depends(get_db)):
    return db.query(ItemMaster).order_by(ItemMaster.sku_code).all()

@router.post("", response_model=ItemOut)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)):
    existing = db.query(ItemMaster).filter(ItemMaster.sku_code == payload.sku_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="SKU code already exists")

    item = ItemMaster(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=ItemOut)
def update_item(item_id: int, payload: ItemCreate, db: Session = Depends(get_db)):
    item = db.query(ItemMaster).filter(ItemMaster.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    for k, v in payload.model_dump().items():
        setattr(item, k, v)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ItemMaster).filter(ItemMaster.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
    