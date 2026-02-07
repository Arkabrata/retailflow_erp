# Test Cases – RetailFlow Inventory Manager

## 1. Testing Approach

Testing for the RetailFlow project was primarily conducted using **manual test cases** to validate core business flows and critical scenarios. The focus was on functional correctness, data consistency, and validation of negative scenarios.

All test cases were executed on the final tagged release **v2.0-sprint2**.

---

## 2. Test Case Summary

| Test Case ID | Scenario | Expected Result | Status |
|-------------|---------|----------------|--------|
| TC-01 | Create Item Master | Item created successfully | Pass |
| TC-02 | Create Vendor Master | Vendor saved successfully | Pass |
| TC-03 | Create Purchase Order | PO created successfully | Pass |
| TC-04 | Create GRN for PO | Inventory increased correctly | Pass |
| TC-05 | POS sale with sufficient stock | Inventory reduced correctly | Pass |
| TC-06 | POS sale with insufficient stock | Error shown, sale blocked | Pass |
| TC-07 | Low-stock alert trigger | Low-stock flag displayed | Pass |
| TC-08 | Analytics dashboard load | Charts rendered correctly | Pass |

---

## 3. Negative Scenario Validation

The following negative scenarios were explicitly tested:

- Attempting POS sale when available inventory is insufficient
- Verifying that inventory quantities do not become negative
- Ensuring alerts are shown when stock falls below minimum threshold

All negative scenarios behaved as expected.

---

## 4. Test Evidence

- Manual testing performed across Inventory, POS, and Analytics modules
- Screenshots captured for key flows (Inventory, POS, Analytics)
- End-to-end validation completed before final release

---

## 5. Conclusion

The testing activities confirm that the RetailFlow system meets its functional requirements and behaves correctly under normal and edge-case scenarios. The application was verified and accepted for final submission.
