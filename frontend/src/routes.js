export const ROUTES = {
    pos: "/pos",
  
    itemMaster: "/inventory/item-master",
    hsnMaster: "/inventory/hsn-master",
    vendorMaster: "/inventory/vendor-master",
    purchaseOrders: "/inventory/purchase-orders",
    grn: "/inventory/grn",
  
    retailerProfile: "/settings/retailer-profile",
    users: "/settings/users",
  
    analytics: "/analytics",
  };
  
  export const PATH_TO_SECTION = Object.fromEntries(
    Object.entries(ROUTES).map(([k, v]) => [v, k])
  );