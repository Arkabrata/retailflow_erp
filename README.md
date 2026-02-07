RetailFlow – Inventory Manager

Agile Software Processes – Course Project
Final Submission (Sprint-1 + Sprint-2)

1. Project Overview

RetailFlow is a small-business Inventory Management System designed to manage end-to-end retail operations, including:

Product catalog (Item Master, HSN Master)

Vendor management

Purchase Orders (PO)

Goods Receipt Notes (GRN)

Inventory stock tracking

Point of Sale (POS) sales

Low-stock alerts

Management analytics dashboards

The project was developed using the Agile Scrum methodology across two sprints, delivering incremental and functional software at the end of each sprint.

2. Sprint Overview
Sprint-1 Goal (Increment-1 – MVP)

Objective:
Establish the foundation of the system and deliver a working prototype implementing the highest-priority user stories.

Focus Areas:

Core backend and frontend setup

Master data management

Procurement flow foundation

Initial working MVP

Sprint-2 Goal (Final Increment)

Objective:
Deliver the complete solution with functional completeness, UI refinement, analytics, and improved Agile maturity.

Focus Areas:

Inventory quantity tracking and validation

POS sales flow with stock deduction

Low-stock alert system

Analytics dashboards (Sales, Inventory, Customers)

ERP/SAP-style UI polish

Testing and documentation

3. Features Implemented
Sprint-1 (v1.0-sprint1)

Item Master (SKU, HSN, pricing)

HSN Master

Vendor Master

Purchase Order creation

PO-based Goods Receipt (GRN foundation)

Backend APIs using FastAPI

Frontend UI using React

Sprint-2 (v2.0-sprint2)

Inventory stock tracking (inward via GRN, outward via POS)

Stock validation and low-stock alerts

POS sales module

Analytics dashboards (Sales, Inventory, Customer insights)

ERP-style UI polish (SAP/Fiori-inspired layout)

Manual testing and validation

Final documentation and reports

4. Tech Stack
Frontend

React (Vite)

Axios

Custom ERP-style CSS

Backend

FastAPI

SQLite

SQLAlchemy ORM

Version Control

GitHub

Branch-based development (dev, main)

Tagged releases for each sprint

5. How to Run the Project
Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

Frontend
cd frontend
npm install
npm run dev

6. Agile Process Evidence

Product backlog created and refined

Sprint backlogs defined for Sprint-1 and Sprint-2

Incremental commits pushed to GitHub

Tagged releases for each sprint

Sprint review demos conducted

Sprint retrospectives documented

Comparison of planned vs delivered scope across sprints

7. Testing & Quality

Manual test cases executed for:

GRN stock updates

POS stock deduction

Low-stock alerts

Additional validation:

Negative scenarios (insufficient stock)

Working demo verified on final tagged release

Test cases documented separately

8. Repository Structure
retailflow_erp/
├── backend/
├── frontend/
├── docs/
├── screenshots/
├── README.md
├── .gitignore
└── LICENSE

9. Releases

Sprint-1 Release: v1.0-sprint1

Sprint-2 Final Release: v2.0-sprint2

10. Team

Arkabrata Chakraborty (2025CA93076)

Preeti Dhyani (2025CA93083)

Shubham Kumar Singh (2025CA93034)

Sumeet Shanbhag (2025CA93036)

Santhosh Kumar DH (2025CA93095)
