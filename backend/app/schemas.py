from typing import List, Optional
from pydantic import BaseModel, ConfigDict


# ===================== HSN =====================

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
    model_config = ConfigDict(from_attributes=True)


# ===================== ITEM =====================

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
    status: str = "DRAFT"
    image_path: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemOut(ItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ===================== VENDOR =====================

class VendorBase(BaseModel):
    vendor_code: Optional[str] = None
    vendor_name: str
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    tagged_skus: Optional[List[str]] = None
    status: str = "Active"


class VendorCreate(VendorBase):
    pass


class VendorOut(BaseModel):
    id: int
    vendor_code: str
    vendor_name: str
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    tagged_skus: List[str] = []
    status: str = "Active"

    model_config = ConfigDict(from_attributes=True)


# ===================== PURCHASE ORDER =====================

class POLineCreate(BaseModel):
    sku_code: str
    description: Optional[str] = None
    qty: float
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
    description: Optional[str] = None
    qty: float
    rate: float
    hsn_code: Optional[str] = None

    cgst_rate: float
    sgst_rate: float
    igst_rate: float

    line_subtotal: float
    cgst_amount: float
    sgst_amount: float
    igst_amount: float
    line_total: float

    model_config = ConfigDict(from_attributes=True)


class PurchaseOrderOut(BaseModel):
    id: int
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

    subtotal: float
    cgst_total: float
    sgst_total: float
    igst_total: float
    grand_total: float

    vendor_code: Optional[str] = None
    vendor_name: Optional[str] = None

    lines: List[PurchaseOrderLineOut] = []

    model_config = ConfigDict(from_attributes=True)


# ===================== GRN =====================

class GRNLineCreate(BaseModel):
    sku_code: str
    received_qty: float
    accepted_qty: float
    rejected_qty: float


class GRNCreate(BaseModel):
    grn_number: Optional[str] = None
    po_id: int
    received_date: str
    remarks: Optional[str] = None

    lines: List[GRNLineCreate]


class GRNLineOut(BaseModel):
    sku_code: str
    received_qty: float
    accepted_qty: float
    rejected_qty: float

    model_config = ConfigDict(from_attributes=True)


class GRNOut(BaseModel):
    id: int
    grn_number: str
    po_id: int
    received_date: str
    remarks: Optional[str] = None

    lines: List[GRNLineOut] = []

    model_config = ConfigDict(from_attributes=True)
