from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import GRN, GRNLine, PurchaseOrder
from ...schemas import GRNCreate, GRNOut

router = APIRouter(prefix="/grn", tags=["GRN"])


def _generate_grn_number(db: Session) -> str:
    last = db.query(GRN).order_by(GRN.id.desc()).first()
    next_id = 1 if not last else last.id + 1
    return f"GRN{next_id:04d}"


@router.post("", response_model=GRNOut)
def create_grn(payload: GRNCreate, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == payload.po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="PO not found")

    if not payload.lines:
        raise HTTPException(status_code=400, detail="GRN must have at least one line")

    grn = GRN(
        grn_number=_generate_grn_number(db),
        po_id=payload.po_id,
        received_date=payload.received_date,
        remarks=payload.remarks,
    )

    for ln in payload.lines:
        if ln.received_qty <= 0:
            continue

        grn.lines.append(
            GRNLine(
                sku_code=ln.sku_code,
                received_qty=ln.received_qty,
                accepted_qty=ln.accepted_qty,
                rejected_qty=ln.rejected_qty,
            )
        )

    db.add(grn)
    db.commit()
    db.refresh(grn)
    return grn


@router.get("", response_model=list[GRNOut])
def list_grns(db: Session = Depends(get_db)):
    return db.query(GRN).order_by(GRN.id.desc()).all()
