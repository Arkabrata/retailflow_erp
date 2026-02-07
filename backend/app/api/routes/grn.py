from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import GRN, GRNLine, PurchaseOrder, InventoryStock
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

    # Track accepted qty per SKU for stock update
    accepted_by_sku: dict[str, float] = {}

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

        if ln.accepted_qty and ln.accepted_qty > 0:
            accepted_by_sku[ln.sku_code] = (
                accepted_by_sku.get(ln.sku_code, 0) + ln.accepted_qty
            )

    if not grn.lines:
        raise HTTPException(status_code=400, detail="No valid GRN lines")

    db.add(grn)
    db.commit()
    db.refresh(grn)

    # ===================== STOCK UPDATE =====================
    for sku, qty in accepted_by_sku.items():
        stock = (
            db.query(InventoryStock)
            .filter(InventoryStock.sku_code == sku)
            .first()
        )

        if stock:
            stock.available_qty += qty
        else:
            db.add(
                InventoryStock(
                    sku_code=sku,
                    available_qty=qty,
                )
            )

    db.commit()
    # ========================================================

    return grn


@router.get("", response_model=list[GRNOut])
def list_grns(db: Session = Depends(get_db)):
    return db.query(GRN).order_by(GRN.id.desc()).all()
