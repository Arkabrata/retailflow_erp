from fastapi import APIRouter

from .routes.health import router as health_router
from .routes.hsn import router as hsn_router
from .routes.items import router as items_router
from .routes.vendors import router as vendors_router
from .routes.purchase_orders import router as po_router
from .routes.grn import router as grn_router
from .routes.inventory import router as inventory_router  # ✅ NEW

api_router = APIRouter(prefix="/api")

api_router.include_router(health_router)
api_router.include_router(hsn_router)
api_router.include_router(items_router)
api_router.include_router(vendors_router)
api_router.include_router(po_router)
api_router.include_router(grn_router)
api_router.include_router(inventory_router)  # ✅ NEW
