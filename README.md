RetailFlow – Inventory Manager

Agile Software Processes – Sprint-1 Submission

1. Project Overview

RetailFlow is a small-business Inventory Management System designed to manage:

Product catalog (Item Master)

Vendors

Purchase Orders (PO)

Goods Receipt Notes (GRN)

Stock inward foundation

The project is developed using Agile Scrum methodology across two sprints.
2. Sprint-1 Goal

Sprint-1 Objective (as per assignment):

Product catalog, stock update foundation, and alert readiness.

Sprint-1 Focus Areas

Establish core backend & frontend structure

Implement highest-priority user stories

Deliver a working MVP

3. Sprint-1 Features Implemented (Working Software)

✔ Item Master (SKU, HSN, Item Type, MRP, Cost Price)
✔ HSN Master
✔ Vendor Master
✔ Purchase Order creation
✔ PO-based Goods Receipt (GRN foundation)
✔ Backend APIs using FastAPI
✔ Frontend UI using React

This version represents Increment-1 (MVP).

4. Tech Stack

Frontend

React (Vite)

Axios

Backend

FastAPI

SQLite

SQLAlchemy ORM

Version Control

GitHub (feature-based commits)

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

Sprint backlog defined for Sprint-1

Incremental commits pushed to GitHub

Working demo prepared for sprint review

Sprint retrospective documented separately

7. Repository Structure
retailflow_erp/
├── backend/
├── frontend/
├── test/
├── README.md
├── .gitignore
└── LICENSE

8. Sprint-1 Release Tag

v1.0-sprint1

9. Sprint-2 Planned Enhancements

Stock quantity tracking

Low-stock alerts

Sales & inventory reports

Supplier integration

UI polish and testing

10. Team

ARKABRATA CHAKRABORTY (2025CA93076)
PREETI DHYANI (2025CA93083)
SHUBHAM KUMAR SINGH (2025CA93034)
SUMEET SHANBHAG (2025CA93036)
SANTHOSH KUMAR DH (2025CA93095)
