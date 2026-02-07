from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import InventoryStock, Sale, SaleLine
from ...schemas import SaleCreate, SaleOut

router = APIRouter(prefix="/sales", tags=["Sales"])


def _generate_bill_number(db: Session) -> str:
    last = db.query(Sale).order_by(Sale.id.desc()).first()
    next_id = 1 if not last else last.id + 1
    return f"BILL-{next_id:04d}"


@router.post("", response_model=SaleOut)
def create_sale(payload: SaleCreate, db: Session = Depends(get_db)):
    if not payload.lines:
        raise HTTPException(status_code=400, detail="Sale must have at least one line")

    # Basic validation: qty > 0
    valid_lines = [ln for ln in payload.lines if (ln.qty or 0) > 0 and ln.sku_code]
    if not valid_lines:
        raise HTTPException(status_code=400, detail="No valid sale lines")

    bill_no = payload.bill_number or _generate_bill_number(db)

    sale = Sale(
        bill_number=bill_no,
        sale_date=payload.sale_date,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
        subtotal=payload.subtotal,
        tax_total=payload.tax_total,
        grand_total=payload.grand_total,
    )

    # accumulate qty per sku to deduct stock
    sold_by_sku: dict[str, float] = {}

    for ln in valid_lines:
        sale.lines.append(SaleLine(**ln.model_dump()))
        sold_by_sku[ln.sku_code] = sold_by_sku.get(ln.sku_code, 0) + (ln.qty or 0)

    # ----- STOCK CHECK + DEDUCT -----
    for sku, sold_qty in sold_by_sku.items():
        stock = db.query(InventoryStock).filter(InventoryStock.sku_code == sku).first()
        if not stock:
            raise HTTPException(status_code=400, detail=f"No stock row for SKU {sku}")
        if (stock.available_qty or 0) < sold_qty:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {sku}. Available={stock.available_qty}, Sold={sold_qty}",
            )

    # persist sale first
    db.add(sale)
    db.commit()
    db.refresh(sale)

    # deduct stock after sale saved
    for sku, sold_qty in sold_by_sku.items():
        stock = db.query(InventoryStock).filter(InventoryStock.sku_code == sku).first()
        stock.available_qty = (stock.available_qty or 0) - sold_qty

    db.commit()
    # -------------------------------

    return sale


@router.get("", response_model=list[SaleOut])
def list_sales(db: Session = Depends(get_db)):
    return db.query(Sale).order_by(Sale.id.desc()).all()

