# main.py

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship


# ---------- DB SETUP (SQLite) ----------

DATABASE_URL = "sqlite:///./retailflow.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ---------- SQLAlchemy MODELS ----------

class HSNMaster(Base):
    __tablename__ = "hsn_master"

    id = Column(Integer, primary_key=True, index=True)
    hsn_code = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    cgst_rate = Column(Float, default=0.0)
    sgst_rate = Column(Float, default=0.0)
    igst_rate = Column(Float, default=0.0)


class ItemMaster(Base):
    __tablename__ = "item_master"

    id = Column(Integer, primary_key=True, index=True)
    sku_code = Column(String, unique=True, index=True, nullable=False)

    brand = Column(String, nullable=True)
    division = Column(String, nullable=True)
    category = Column(String, nullable=True)
    sub_category = Column(String, nullable=True)
    style = Column(String, nullable=True)
    color = Column(String, nullable=True)
    size = Column(String, nullable=True)

    # Link to HSN (by code)
    hsn_code = Column(String, nullable=True)

    # For POS visibility: "PUBLISHED" or "DRAFT"
    status = Column(String, default="DRAFT")

    # For now we just store a file name / path (no upload yet)
    image_path = Column(String, nullable=True)


class VendorMaster(Base):
    __tablename__ = "vendor_master"

    id = Column(Integer, primary_key=True, index=True)

    vendor_code = Column(String, unique=True, index=True, nullable=False)
    vendor_name = Column(String, nullable=False)

    address = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    # We will store multiple SKUs as a comma-separated string like "RR-001,RR-002"
    tagged_skus = Column(String, nullable=True)

    # "Active" or "Inactive"
    status = Column(String, default="Active")


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, nullable=False)

    po_number = Column(String, nullable=True)
    po_date = Column(String, nullable=False)
    expiry_date = Column(String, nullable=False)
    payment_terms = Column(String, nullable=True)
    remarks = Column(String, nullable=True)
    tax_mode = Column(String, nullable=False)  # "CGST_SGST" or "IGST"

    # retailer snapshot (copied from front-end constants)
    retailer_name = Column(String, nullable=False)
    retailer_address = Column(String, nullable=False)
    retailer_gstin = Column(String, nullable=False)

    subtotal = Column(Float, default=0.0)
    cgst_total = Column(Float, default=0.0)
    sgst_total = Column(Float, default=0.0)
    igst_total = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)

    lines = relationship(
        "PurchaseOrderLine",
        back_populates="po",
        cascade="all, delete-orphan",
    )


class PurchaseOrderLine(Base):
    __tablename__ = "purchase_order_lines"

    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)

    sku_code = Column(String, nullable=False)
    hsn_code = Column(String, nullable=True)
    description = Column(String, nullable=True)

    qty = Column(Float, default=0.0)
    rate = Column(Float, default=0.0)

    cgst_rate = Column(Float, default=0.0)
    sgst_rate = Column(Float, default=0.0)
    igst_rate = Column(Float, default=0.0)

    # numbers *for this line*
    line_subtotal = Column(Float, default=0.0)  # before tax
    cgst_amount = Column(Float, default=0.0)
    sgst_amount = Column(Float, default=0.0)
    igst_amount = Column(Float, default=0.0)
    line_total = Column(Float, default=0.0)     # after tax

    po = relationship("PurchaseOrder", back_populates="lines")


def init_db():
    Base.metadata.create_all(bind=engine)


# ---------- Pydantic SCHEMAS ----------

class HSNBase(BaseModel):
    hsn_code: str
    description: Optional[str] = None
    cgst_rate: float = 0.0
    sgst_rate: float = 0.0
    igst_rate: float = 0.0


class HSNCreate(HSNBase):
    pass


class HSNOut(HSNBase):
    id: int

    class Config:
        orm_mode = True


class ItemBase(BaseModel):
    sku_code: str
    brand: Optional[str] = None
    division: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    style: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None
    hsn_code: Optional[str] = None
    status: str = "DRAFT"   # or "PUBLISHED"
    image_path: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemOut(ItemBase):
    id: int

    class Config:
        orm_mode = True


def _generate_vendor_code(db: Session) -> str:
    """
    Very simple auto-code generator: V0001, V0002, ...
    Uses current max(id) and adds 1.
    """
    last = db.query(VendorMaster).order_by(VendorMaster.id.desc()).first()
    next_num = 1 if not last else (last.id + 1)
    return f"V{next_num:04d}"


class VendorBase(BaseModel):
    vendor_code: Optional[str] = None     # we can auto-generate if not sent
    vendor_name: str
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    tagged_skus: Optional[List[str]] = None  # list of SKU codes
    status: str = "Active"                   # "Active" or "Inactive"


class VendorCreate(VendorBase):
    pass


class VendorOut(BaseModel):
    id: int
    vendor_code: str
    vendor_name: str
    address: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    tagged_skus: List[str]
    status: str

    class Config:
        orm_mode = True


class POLineCreate(BaseModel):
    sku_code: str
    description: Optional[str] = None
    qty: int
    rate: float
    hsn_code: Optional[str] = None

    cgst_rate: float = 0.0
    sgst_rate: float = 0.0
    igst_rate: float = 0.0

    line_subtotal: float = 0.0
    cgst_amount: float = 0.0
    sgst_amount: float = 0.0
    igst_amount: float = 0.0
    line_total: float = 0.0


class PurchaseOrderCreate(BaseModel):
    po_number: Optional[str] = None
    po_date: str
    expiry_date: str
    payment_terms: Optional[str] = None
    remarks: Optional[str] = None
    tax_mode: str
    vendor_id: int

    retailer_name: str
    retailer_address: str
    retailer_gstin: str

    lines: List[POLineCreate]


class PurchaseOrderLineOut(BaseModel):
    sku_code: str
    description: Optional[str]
    qty: int
    rate: float
    hsn_code: Optional[str]
    cgst_rate: float
    sgst_rate: float
    igst_rate: float
    line_subtotal: float
    cgst_amount: float
    sgst_amount: float
    igst_amount: float
    line_total: float

    class Config:
        from_attributes = True


class PurchaseOrderOut(BaseModel):
    id: int
    po_number: Optional[str]
    po_date: str
    expiry_date: str
    payment_terms: Optional[str]
    remarks: Optional[str]
    tax_mode: str
    vendor_id: int

    retailer_name: str
    retailer_address: str
    retailer_gstin: str

    subtotal: float
    cgst_total: float
    sgst_total: float
    igst_total: float
    grand_total: float

    # optional vendor info for list
    vendor_code: Optional[str] = None
    vendor_name: Optional[str] = None

    lines: List[PurchaseOrderLineOut]

    class Config:
        from_attributes = True


# ---------- FastAPI APP + CORS ----------

app = FastAPI(title="RetailFlow API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- DB SESSION DEPENDENCY ----------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    init_db()


# ---------- HEALTH CHECK ----------

@app.get("/api/ping")
def ping():
    return {
        "status": "ok",
        "message": "RetailFlow backend is alive with SQLite DB.",
    }


# ---------- HSN MASTER CRUD APIs ----------

@app.get("/api/hsn", response_model=List[HSNOut])
def list_hsn(db: Session = Depends(get_db)):
    hsns = db.query(HSNMaster).order_by(HSNMaster.hsn_code).all()
    return hsns


@app.post("/api/hsn", response_model=HSNOut)
def create_hsn(payload: HSNCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(HSNMaster)
        .filter(HSNMaster.hsn_code == payload.hsn_code)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="HSN code already exists")

    h = HSNMaster(
        hsn_code=payload.hsn_code,
        description=payload.description,
        cgst_rate=payload.cgst_rate,
        sgst_rate=payload.sgst_rate,
        igst_rate=payload.igst_rate,
    )
    db.add(h)
    db.commit()
    db.refresh(h)
    return h


@app.put("/api/hsn/{hsn_id}", response_model=HSNOut)
def update_hsn(hsn_id: int, payload: HSNCreate, db: Session = Depends(get_db)):
    h = db.query(HSNMaster).filter(HSNMaster.id == hsn_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="HSN not found")

    h.hsn_code = payload.hsn_code
    h.description = payload.description
    h.cgst_rate = payload.cgst_rate
    h.sgst_rate = payload.sgst_rate
    h.igst_rate = payload.igst_rate

    db.commit()
    db.refresh(h)
    return h


@app.delete("/api/hsn/{hsn_id}")
def delete_hsn(hsn_id: int, db: Session = Depends(get_db)):
    h = db.query(HSNMaster).filter(HSNMaster.id == hsn_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="HSN not found")
    db.delete(h)
    db.commit()
    return {"ok": True}


# ---------- ITEM MASTER CRUD APIs ----------

@app.get("/api/items", response_model=List[ItemOut])
def list_items(db: Session = Depends(get_db)):
    items = db.query(ItemMaster).order_by(ItemMaster.sku_code).all()
    return items


@app.post("/api/items", response_model=ItemOut)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)):
    # Ensure SKU is unique
    existing = (
        db.query(ItemMaster)
        .filter(ItemMaster.sku_code == payload.sku_code)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="SKU code already exists")

    item = ItemMaster(
        sku_code=payload.sku_code,
        brand=payload.brand,
        division=payload.division,
        category=payload.category,
        sub_category=payload.sub_category,
        style=payload.style,
        color=payload.color,
        size=payload.size,
        hsn_code=payload.hsn_code,
        status=payload.status,
        image_path=payload.image_path,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.put("/api/items/{item_id}", response_model=ItemOut)
def update_item(item_id: int, payload: ItemCreate, db: Session = Depends(get_db)):
    item = db.query(ItemMaster).filter(ItemMaster.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.sku_code = payload.sku_code
    item.brand = payload.brand
    item.division = payload.division
    item.category = payload.category
    item.sub_category = payload.sub_category
    item.style = payload.style
    item.color = payload.color
    item.size = payload.size
    item.hsn_code = payload.hsn_code
    item.status = payload.status
    item.image_path = payload.image_path

    db.commit()
    db.refresh(item)
    return item


@app.delete("/api/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ItemMaster).filter(ItemMaster.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"ok": True}


# ---------- VENDOR MASTER CRUD APIs ----------

@app.get("/api/vendors", response_model=List[VendorOut])
def list_vendors(db: Session = Depends(get_db)):
    vendors = db.query(VendorMaster).order_by(VendorMaster.vendor_code).all()

    result: List[VendorOut] = []
    for v in vendors:
        sku_list = (
            v.tagged_skus.split(",") if v.tagged_skus and v.tagged_skus.strip() else []
        )
        result.append(
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
    return result


@app.post("/api/vendors", response_model=VendorOut)
def create_vendor(payload: VendorCreate, db: Session = Depends(get_db)):
    # Vendor code: use given one or auto-generate
    code = payload.vendor_code.strip() if payload.vendor_code else None
    if not code:
        code = _generate_vendor_code(db)

    # Check unique vendor_code
    existing = (
        db.query(VendorMaster)
        .filter(VendorMaster.vendor_code == code)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Vendor code already exists")

    tagged_skus_str = (
        ",".join(payload.tagged_skus) if payload.tagged_skus else None
    )

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


@app.put("/api/vendors/{vendor_id}", response_model=VendorOut)
def update_vendor(
    vendor_id: int, payload: VendorCreate, db: Session = Depends(get_db)
):
    v = db.query(VendorMaster).filter(VendorMaster.id == vendor_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vendor not found")

    # If vendor_code sent, we respect it, else keep existing
    if payload.vendor_code and payload.vendor_code.strip():
        new_code = payload.vendor_code.strip()
        # ensure no duplicate with another vendor
        conflict = (
            db.query(VendorMaster)
            .filter(
                VendorMaster.vendor_code == new_code,
                VendorMaster.id != vendor_id,
            )
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

    v.tagged_skus = (
        ",".join(payload.tagged_skus) if payload.tagged_skus else None
    )

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


@app.delete("/api/vendors/{vendor_id}")
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    v = db.query(VendorMaster).filter(VendorMaster.id == vendor_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vendor not found")

    db.delete(v)
    db.commit()
    return {"ok": True}


# ---------- PURCHASE ORDER APIs ----------

@app.post("/api/purchase-orders", response_model=PurchaseOrderOut)
def create_purchase_order(
    payload: PurchaseOrderCreate,
    db: Session = Depends(get_db),
):
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

    subtotal = 0.0
    cgst_total = 0.0
    sgst_total = 0.0
    igst_total = 0.0
    grand_total = 0.0

    for ln in payload.lines:
        line = PurchaseOrderLine(
            sku_code=ln.sku_code,
            description=ln.description,
            qty=ln.qty,
            rate=ln.rate,
            hsn_code=ln.hsn_code,
            cgst_rate=ln.cgst_rate,
            sgst_rate=ln.sgst_rate,
            igst_rate=ln.igst_rate,
            line_subtotal=ln.line_subtotal,
            cgst_amount=ln.cgst_amount,
            sgst_amount=ln.sgst_amount,
            igst_amount=ln.igst_amount,
            line_total=ln.line_total,
        )
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

    # decorate with vendor info for response
    vendor = db.query(VendorMaster).filter(VendorMaster.id == po.vendor_id).first()
    out = PurchaseOrderOut.from_orm(po)
    if vendor:
        out.vendor_code = vendor.vendor_code
        out.vendor_name = vendor.vendor_name
    return out


@app.get("/api/purchase-orders", response_model=List[PurchaseOrderOut])
def list_purchase_orders(db: Session = Depends(get_db)):
    pos = db.query(PurchaseOrder).order_by(PurchaseOrder.id.desc()).all()

    result: List[PurchaseOrderOut] = []
    for po in pos:
        vendor = db.query(VendorMaster).filter(VendorMaster.id == po.vendor_id).first()
        out = PurchaseOrderOut.from_orm(po)
        if vendor:
            out.vendor_code = vendor.vendor_code
            out.vendor_name = vendor.vendor_name
        result.append(out)
    return result
