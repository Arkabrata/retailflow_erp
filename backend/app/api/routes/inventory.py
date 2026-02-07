from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import ItemMaster, InventoryStock

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("")
def list_inventory(db: Session = Depends(get_db)):
    """
    Returns SKU master + current stock.
    Used by InventoryPage.
    """
    items = db.query(ItemMaster).order_by(ItemMaster.id.desc()).all()

    # build map: sku -> qty
    stocks = db.query(InventoryStock).all()
    stock_map = {s.sku_code: float(s.available_qty or 0) for s in stocks}

    out = []
    for it in items:
        out.append(
            {
                "sku_code": it.sku_code,
                "brand": it.brand,
                "category": it.category,
                "style": it.style,
                "min_stock_level": int(it.min_stock_level or 0),
                "available_qty": float(stock_map.get(it.sku_code, 0)),
            }
        )
    return out


@router.get("/low-stock")
def low_stock(db: Session = Depends(get_db)):
    """
    Low stock = available_qty <= min_stock_level.
    """
    items = db.query(ItemMaster).all()
    stocks = db.query(InventoryStock).all()
    stock_map = {s.sku_code: float(s.available_qty or 0) for s in stocks}

    low = []
    for it in items:
        sku = it.sku_code
        avail = float(stock_map.get(sku, 0))
        min_lvl = float(it.min_stock_level or 0)
        if avail <= min_lvl:
            low.append(
                {
                    "sku_code": sku,
                    "available_qty": avail,
                    "min_stock_level": min_lvl,
                }
            )
    return low
