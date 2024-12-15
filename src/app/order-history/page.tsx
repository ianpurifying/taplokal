// src/app/order-history/page.tsx
import React from "react";
import OrderHistory from "../components/OrderHistory";

// Example customerId, replace with dynamic data as needed
const customerId = "exampleCustomerId"; // Replace with actual customer ID logic

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <OrderHistory customerId={customerId} />
    </div>
  );
}
