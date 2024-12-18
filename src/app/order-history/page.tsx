import React from "react";
import OrderHistory from "../components/OrderHistory";

const OrderHistoryPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
      {" "}
      {/* Added pt-20 to add padding at the top */}
      <OrderHistory />
    </div>
  );
};

export default OrderHistoryPage;
