from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ...db import get_db
from ...models import VendorMaster
from ...schemas import VendorCreate, VendorOut

router = APIRouter(prefix="/vendors", tags=["Vendor Master"])


def _normalize_skus(skus: list[str] | None) -> list[str]:
    if not skus:
        return []
    clean = []
    seen = set()
    for s in skus:
        if not s:
            continue
        x = s.strip()
        if not x or x in seen:
            continue
        seen.add(x)
        clean.append(x)
    return clean


def _skus_to_str(skus: list[str]) -> str | None:
    skus = _normalize_skus(skus)
    return ",".join(skus) if skus else None


def _str_to_skus(s: str | None) -> list[str]:
    if not s or not s.strip():
        return []
    return _normalize_skus(s.split(","))


def _generate_vendor_code(db: Session) -> str:
    # NOTE: still not perfect under concurrency; UNIQUE constraint + IntegrityError handling covers it
    last = db.query(VendorMaster).order_by(VendorMaster.id.desc()).first()
    next_num = 1 if not last else (last.id + 1)
    return f"V{next_num:04d}"


@router.get("", response_model=list[VendorOut])
def list_vendors(db: Session = Depends(get_db)):
    vendors = db.query(VendorMaster).order_by(VendorMaster.vendor_code).all()
    out = []
    for v in vendors:
        out.append(
            VendorOut(
                id=v.id,
                vendor_code=v.vendor_code,
                vendor_name=v.vendor_name,
                address=v.address,
                email=v.email,
                phone=v.phone,
                tagged_skus=_str_to_skus(v.tagged_skus),
                status=v.status or "Active",
            )
        )
    return out


@router.post("", response_model=VendorOut)
def create_vendor(payload: VendorCreate, db: Session = Depends(get_db)):
    if not payload.vendor_name or not payload.vendor_name.strip():
        raise HTTPException(status_code=400, detail="Vendor name is required")

    # vendor_code: accept if given, else auto-generate
    code = payload.vendor_code.strip() if payload.vendor_code and payload.vendor_code.strip() else None
    if not code:
        code = _generate_vendor_code(db)

    sku_list = _normalize_skus(payload.tagged_skus)
    tagged_skus_str = _skus_to_str(sku_list)

    v = VendorMaster(
        vendor_code=code,
        vendor_name=payload.vendor_name.strip(),
        address=(payload.address or "").strip(),
        email=(payload.email or "").strip(),
        phone=(payload.phone or "").strip(),
        tagged_skus=tagged_skus_str,
        status=(payload.status or "Active").strip(),
    )

    db.add(v)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # If code collision happened, raise clean message
        raise HTTPException(status_code=400, detail="Vendor code already exists")

    db.refresh(v)

    return VendorOut(
        id=v.id,
        vendor_code=v.vendor_code,
        vendor_name=v.vendor_name,
        address=v.address,
        email=v.email,
        phone=v.phone,
        tagged_skus=_str_to_skus(v.tagged_skus),
        status=v.status or "Active",
    )


@router.put("/{vendor_id}", response_model=VendorOut)
def update_vendor(vendor_id: int, payload: VendorCreate, db: Session = Depends(get_db)):
    v = db.query(VendorMaster).filter(VendorMaster.id == vendor_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vendor not found")

    if not payload.vendor_name or not payload.vendor_name.strip():
        raise HTTPException(status_code=400, detail="Vendor name is required")

    # vendor_code update (optional)
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

    v.vendor_name = payload.vendor_name.strip()
    v.address = (payload.address or "").strip()
    v.email = (payload.email or "").strip()
    v.phone = (payload.phone or "").strip()
    v.status = (payload.status or "Active").strip()

    sku_list = _normalize_skus(payload.tagged_skus)
    v.tagged_skus = _skus_to_str(sku_list)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Update failed due to constraint conflict")

    db.refresh(v)

    return VendorOut(
        id=v.id,
        vendor_code=v.vendor_code,
        vendor_name=v.vendor_name,
        address=v.address,
        email=v.email,
        phone=v.phone,
        tagged_skus=_str_to_skus(v.tagged_skus),
        status=v.status or "Active",
    )


@router.delete("/{vendor_id}")
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    v = db.query(VendorMaster).filter(VendorMaster.id == vendor_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vendor not found")
    db.delete(v)
    db.commit()
    return {"ok": True}