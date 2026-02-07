from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .db import Base


# ===================== HSN =====================

class HSNMaster(Base):
    __tablename__ = "hsn_master"

    id = Column(Integer, primary_key=True, index=True)
    hsn_code = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    cgst_rate = Column(Float, default=0.0)
    sgst_rate = Column(Float, default=0.0)
    igst_rate = Column(Float, default=0.0)


# ===================== ITEM =====================

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

    hsn_code = Column(String, nullable=True)
    status = Column(String, default="DRAFT")
    image_path = Column(String, nullable=True)

    # ✅ Sprint-1: Low stock threshold
    min_stock_level = Column(Integer, default=10)


# ===================== VENDOR =====================

class VendorMaster(Base):
    __tablename__ = "vendor_master"

    id = Column(Integer, primary_key=True, index=True)
    vendor_code = Column(String, unique=True, index=True, nullable=False)
    vendor_name = Column(String, nullable=False)

    address = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    tagged_skus = Column(String, nullable=True)  # comma-separated
    status = Column(String, default="Active")


# ===================== PURCHASE ORDER =====================

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, nullable=False)

    po_number = Column(String, nullable=True)
    po_date = Column(String, nullable=False)
    expiry_date = Column(String, nullable=False)
    payment_terms = Column(String, nullable=True)
    remarks = Column(String, nullable=True)
    tax_mode = Column(String, nullable=False)

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

    line_subtotal = Column(Float, default=0.0)
    cgst_amount = Column(Float, default=0.0)
    sgst_amount = Column(Float, default=0.0)
    igst_amount = Column(Float, default=0.0)
    line_total = Column(Float, default=0.0)

    po = relationship("PurchaseOrder", back_populates="lines")


# ===================== GRN =====================

class GRN(Base):
    __tablename__ = "grn"

    id = Column(Integer, primary_key=True, index=True)
    grn_number = Column(String, unique=True, index=True, nullable=False)

    po_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    received_date = Column(String, nullable=False)
    remarks = Column(String, nullable=True)

    lines = relationship(
        "GRNLine",
        back_populates="grn",
        cascade="all, delete-orphan",
    )


class GRNLine(Base):
    __tablename__ = "grn_lines"

    id = Column(Integer, primary_key=True, index=True)
    grn_id = Column(Integer, ForeignKey("grn.id"), nullable=False)

    sku_code = Column(String, nullable=False)
    received_qty = Column(Float, default=0.0)
    accepted_qty = Column(Float, default=0.0)
    rejected_qty = Column(Float, default=0.0)

    grn = relationship("GRN", back_populates="lines")


# ===================== INVENTORY STOCK =====================

class InventoryStock(Base):
    __tablename__ = "inventory_stock"

    sku_code = Column(String, primary_key=True, index=True)
    available_qty = Column(Float, default=0.0)


# ===================== SALES =====================

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    bill_number = Column(String, unique=True, index=True, nullable=False)
    sale_date = Column(String, nullable=False)

    customer_name = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)

    subtotal = Column(Float, default=0.0)
    tax_total = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)

    lines = relationship(
        "SaleLine",
        back_populates="sale",
        cascade="all, delete-orphan",
    )


class SaleLine(Base):
    __tablename__ = "sale_lines"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False)

    sku_code = Column(String, nullable=False)
    description = Column(String, nullable=True)
    hsn_code = Column(String, nullable=True)

    qty = Column(Float, default=0.0)
    rate = Column(Float, default=0.0)

    cgst_rate = Column(Float, default=0.0)
    sgst_rate = Column(Float, default=0.0)
    igst_rate = Column(Float, default=0.0)

    line_subtotal = Column(Float, default=0.0)
    line_tax = Column(Float, default=0.0)
    line_total = Column(Float, default=0.0)

    sale = relationship("Sale", back_populates="lines")
