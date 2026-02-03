from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import VendorMaster
from ...schemas import VendorCreate, VendorOut

router = APIRouter(prefix="/vendors", tags=["Vendor Master"])

def _generate_vendor_code(db: Session) -> str:
    last = db.query(VendorMaster).order_by(VendorMaster.id.desc()).first()
    next_num = 1 if not last else (last.id + 1)
    return f"V{next_num:04d}"

@router.get("", response_model=list[VendorOut])
def list_vendors(db: Session = Depends(get_db)):
    vendors = db.query(VendorMaster).order_by(VendorMaster.vendor_code).all()
    out = []
    for v in vendors:
        sku_list = v.tagged_skus.split(",") if v.tagged_skus and v.tagged_skus.strip() else []
        out.append(
            VendorOut(
                id=v.id,
                vendor_code=v.vendor_code,
                vendor_name=v.vendor_name,
                address=v.address,
                email=v.email,
                phone=v.phone,
                tagged_skus=sku_list,
                status=v.status or "Active",
            )
        )
    return out

@router.post("", response_model=VendorOut)
def create_vendor(payload: VendorCreate, db: Session = Depends(get_db)):
    code = payload.vendor_code.strip() if payload.vendor_code else None
    if not code:
        code = _generate_vendor_code(db)

    existing = db.query(VendorMaster).filter(VendorMaster.vendor_code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vendor code already exists")

    tagged_skus_str = ",".join(payload.tagged_skus) if payload.tagged_skus else None

    v = VendorMaster(
        vendor_code=code,
        vendor_name=payload.vendor_name,
        address=payload.address,
        email=payload.email,
        phone=payload.phone,
        tagged_skus=tagged_skus_str,
        status=payload.status or "Active",
    )
    db.add(v)
    db.commit()
    db.refresh(v)

    return VendorOut(
        id=v.id,
        vendor_code=v.vendor_code,
        vendor_name=v.vendor_name,
        address=v.address,
        email=v.email,
        phone=v.phone,
        tagged_skus=payload.tagged_skus or [],
        status=v.status,
    )

@router.put("/{vendor_id}", response_model=VendorOut)
def update_vendor(vendor_id: int, payload: VendorCreate, db: Session = Depends(get_db)):
    v = db.query(VendorMaster).filter(VendorMaster.id == vendor_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vendor not found")

    if payload.vendor_code and payload.vendor_code.strip():
        new_code = payload.vendor_code.strip()
        conflict = (
            db.query(VendorMaster)
            .filter(VendorMaster.vendor_code == new_code, VendorMaster.id != vendor_id)
            .first()
        )
        if conflict:
            raise HTTPException(status_code=400, detail="Vendor code already used by another vendor")
        v.vendor_code = new_code

    v.vendor_name = payload.vendor_name
    v.address = payload.address
    v.email = payload.email
    v.phone = payload.phone
    v.status = payload.status or "Active"
    v.tagged_skus = ",".join(payload.tagged_skus) if payload.tagged_skus else None

    db.commit()
    db.refresh(v)

    sku_list = payload.tagged_skus or []
    return VendorOut(
        id=v.id,
        vendor_code=v.vendor_code,
        vendor_name=v.vendor_name,
        address=v.address,
        email=v.email,
        phone=v.phone,
        tagged_skus=sku_list,
        status=v.status,
    )

@router.delete("/{vendor_id}")
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    v = db.query(VendorMaster).filter(VendorMaster.id == vendor_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vendor not found")
    db.delete(v)
    db.commit()
    return {"ok": True}