export const roleAccess = {
  Admin: [
    "pos",
    "inventory",
    "itemMaster",
    "hsnMaster",
    "suppliers",
    "vendorMaster",
    "purchaseOrders",
    "grn",
    "analytics",
    "settings",
    "retailerProfile",
    "users",
  ],
  "Store Manager": ["pos", "analytics"],
  "Inventory Manager": [
    "inventory",
    "itemMaster",
    "hsnMaster",
    "suppliers",
    "vendorMaster",
    "purchaseOrders",
    "grn",
  ],
  "Sales Manager": ["pos", "analytics"],
};

export function canAccess(user, section) {
  if (!user) return false;
  const allowed = roleAccess[user.role] || [];
  return allowed.includes(section);
}
