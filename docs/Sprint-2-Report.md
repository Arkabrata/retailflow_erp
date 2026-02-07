# Sprint-2 Final Report – RetailFlow Inventory Manager

## 1. Sprint Overview

**Sprint Duration:** Sprint-2  
**Sprint Goal:**  
To deliver the completed RetailFlow system with functional completeness, improved usability, analytics capabilities, and evidence of Agile maturity.

Sprint-2 focused on extending the Sprint-1 MVP by adding inventory logic, sales flow, analytics dashboards, UI refinements, and comprehensive documentation, resulting in a deployable final increment.

---

## 2. Sprint-2 Objectives

The objectives defined at the beginning of Sprint-2 were:

- Implement inventory quantity tracking
- Add POS sales flow with stock deduction
- Enable low-stock alerts
- Build analytics dashboards for business insights
- Improve UI and user experience
- Address feedback received during Sprint-1 review
- Finalize documentation and testing

---

## 3. Sprint-2 Backlog (Planned vs Completed)

| User Story | Description | Status |
|----------|------------|--------|
| US-08 | Inventory stock tracking | Completed |
| US-09 | POS sales module | Completed |
| US-10 | Low-stock alert system | Completed |
| US-11 | Analytics dashboards | Completed |
| US-12 | UI/UX improvements | Completed |
| US-13 | Testing and validation | Completed |
| US-14 | Final documentation | Completed |

All user stories planned for Sprint-2 were completed successfully within the sprint timeline.

---

## 4. Increment Delivered (Final Working Software)

At the end of Sprint-2, the following features were delivered:

- Inventory stock tracking with:
  - Stock increase via GRN
  - Stock decrease via POS sales
- Stock validation to prevent negative inventory
- Low-stock alert indicators based on configured thresholds
- POS sales workflow integrated with inventory
- Analytics dashboards providing:
  - Sales trends
  - Inventory overview
  - Customer-related insights
- ERP/SAP-style UI polish for improved usability
- Fully working end-to-end retail flow

This increment represents the **final, fully functional version** of the RetailFlow system.

---

## 5. Sprint-1 Feedback and Improvements in Sprint-2

Feedback received during the Sprint-1 review was analyzed and incorporated into Sprint-2:

| Sprint-1 Feedback | Action Taken in Sprint-2 |
|------------------|--------------------------|
| Add inventory quantity tracking | Implemented inventory stock table and logic |
| Support stock reduction | POS sales module added |
| Improve UI usability | ERP-style UI polish applied |
| Add reporting | Analytics dashboards implemented |

---

## 6. Sprint Review Summary

During the Sprint-2 review, the team demonstrated:

- End-to-end operational flow:
  - Purchase Order → GRN → Inventory update
  - POS Sale → Inventory reduction
- Real-time low-stock alerts
- Analytics dashboards
- Improved and consistent UI

The final system met all defined objectives and demonstrated a complete, usable product.

---

## 7. Testing & Quality Assurance

Testing activities conducted during Sprint-2 included:

- Manual test cases for:
  - GRN stock updates
  - POS stock deduction
  - Low-stock alerts
- Validation of negative scenarios (e.g., insufficient stock)
- End-to-end flow testing across modules
- Final verification using tagged release `v2.0-sprint2`

All critical functional scenarios were validated successfully.

---

## 8. Challenges Faced and Mitigation

### Challenges
- Managing state consistency between inventory, sales, and procurement modules
- UI consistency across multiple pages
- Time constraints for additional enhancements

### Mitigation
- Clear separation of backend and frontend responsibilities
- Incremental validation and testing
- Prioritization of core functional requirements

---

## 9. Future Scope

If additional sprints were available, the following enhancements would be considered:

- Cloud deployment using free-tier platforms
- Automated unit and integration testing
- Supplier integration and invoice management
- Exportable analytics reports
- Role-based access control enhancements

---

## 10. Conclusion

Sprint-2 successfully delivered the final increment of RetailFlow.  
The project demonstrates effective application of Agile Scrum practices, incremental delivery, and reflection-driven improvement across sprints.
