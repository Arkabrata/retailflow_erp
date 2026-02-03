from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import PurchaseOrder, PurchaseOrderLine, VendorMaster
from ...schemas import PurchaseOrderCreate, PurchaseOrderOut

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])

@router.post("", response_model=PurchaseOrderOut)
def create_purchase_order(payload: PurchaseOrderCreate, db: Session = Depends(get_db)):
    if not payload.lines:
        raise HTTPException(status_code=400, detail="PO must have at least one line")

    po = PurchaseOrder(
        po_number=payload.po_number,
        po_date=payload.po_date,
        expiry_date=payload.expiry_date,
        payment_terms=payload.payment_terms,
        remarks=payload.remarks,
        tax_mode=payload.tax_mode,
        vendor_id=payload.vendor_id,
        retailer_name=payload.retailer_name,
        retailer_address=payload.retailer_address,
        retailer_gstin=payload.retailer_gstin,
    )

    subtotal = cgst_total = sgst_total = igst_total = grand_total = 0.0

    for ln in payload.lines:
        line = PurchaseOrderLine(**ln.model_dump())
        po.lines.append(line)

        subtotal += ln.line_subtotal
        cgst_total += ln.cgst_amount
        sgst_total += ln.sgst_amount
        igst_total += ln.igst_amount
        grand_total += ln.line_total

    po.subtotal = subtotal
    po.cgst_total = cgst_total
    po.sgst_total = sgst_total
    po.igst_total = igst_total
    po.grand_total = grand_total

    db.add(po)
    db.commit()
    db.refresh(po)

    vendor = db.query(VendorMaster).filter(VendorMaster.id == po.vendor_id).first()

    out = PurchaseOrderOut.model_validate(po)
    if vendor:
        out.vendor_code = vendor.vendor_code
        out.vendor_name = vendor.vendor_name
    return out

@router.get("", response_model=list[PurchaseOrderOut])
def list_purchase_orders(db: Session = Depends(get_db)):
    pos = db.query(PurchaseOrder).order_by(PurchaseOrder.id.desc()).all()

    result = []
    for po in pos:
        vendor = db.query(VendorMaster).filter(VendorMaster.id == po.vendor_id).first()
        out = PurchaseOrderOut.model_validate(po)
        if vendor:
            out.vendor_code = vendor.vendor_code
            out.vendor_name = vendor.vendor_name
        result.append(out)
    return result