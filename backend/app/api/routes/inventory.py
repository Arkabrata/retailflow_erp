from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db import get_db
from ...models import ItemMaster, InventoryStock

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/low-stock")
def low_stock_alerts(db: Session = Depends(get_db)):
    rows = (
        db.query(
            ItemMaster.sku_code,
            InventoryStock.available_qty,
            ItemMaster.min_stock_level,
        )
        .join(
            InventoryStock,
            InventoryStock.sku_code == ItemMaster.sku_code,
        )
        .filter(InventoryStock.available_qty < ItemMaster.min_stock_level)
        .all()
    )

    return [
        {
            "sku_code": r.sku_code,
            "available_qty": r.available_qty,
            "min_stock_level": r.min_stock_level,
        }
        for r in rows
    ]
