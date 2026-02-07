// src/App.jsx
import { useState } from "react";
import "./App.css";

import Topbar from "./layout/Topbar";
import Sidebar from "./layout/Sidebar";
import LoginScreen from "./screens/LoginScreen";

// Pages
import POSPage from "./pages/POS/POSPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import ItemMasterPage from "./pages/Inventory/ItemMasterPage";
import HSNMasterPage from "./pages/Inventory/HSNMasterPage";
import VendorMasterPage from "./pages/Inventory/VendorMasterPage";
import PurchaseOrderPage from "./pages/Inventory/PurchaseOrderPage";
import GRNPage from "./pages/Inventory/GRNPage";
import RetailerProfilePage from "./pages/Settings/RetailerProfilePage";
import UserManagementPage from "./pages/Settings/UserManagementPage";
import AnalyticsHome from "./pages/Analytics/AnalyticsHome";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("pos");
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return (
    <div className="rf-app">
      <Topbar
        currentUser={currentUser}
        onToggleSidebar={() => setIsCollapsed((p) => !p)}
        onLogout={() => setCurrentUser(null)}
      />

      <div className="rf-layout">
        <Sidebar
          collapsed={isCollapsed}
          active={activeSection}
          onNavigate={setActiveSection}
        />

        <main className="rf-content">
          {activeSection === "pos" && <POSPage />}
          {activeSection === "inventory" && <InventoryPage />}
          {activeSection === "itemMaster" && <ItemMasterPage />}
          {activeSection === "hsnMaster" && <HSNMasterPage />}
          {activeSection === "vendorMaster" && <VendorMasterPage />}
          {activeSection === "purchaseOrders" && <PurchaseOrderPage />}
          {activeSection === "grn" && <GRNPage />}
          {activeSection === "retailerProfile" && <RetailerProfilePage />}
          {activeSection === "users" && <UserManagementPage />}
          {activeSection === "analytics" && <AnalyticsHome />}
        </main>
      </div>
    </div>
  );
}