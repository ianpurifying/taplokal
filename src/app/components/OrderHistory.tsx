"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import { fs } from "../firebaseConfig";
import { CartDetails, ItemCart } from "../Types";

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<CartDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Explicitly type the user state

  // Fetch the user on component mount
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Now this correctly sets `User | null`
    });
    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  // Fetch orders when the user is authenticated
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setOrders([]); // Reset orders when no user is authenticated
      return;
    }

    const fetchOrders = async () => {
      try {
        const checkoutsRef = collection(fs, "checkouts");
        const q = query(checkoutsRef, where("customerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No orders found for this user.");
          setOrders([]);
        } else {
          const fetchedOrders: CartDetails[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id, // Now part of CartDetails
              cartId: data.cartId,
              customerId: data.customerId,
              orderNumber: data.orderNumber,
              transactionNumber: data.transactionNumber,
              dineInOrTakeout: data.dineInOrTakeout,
              items: data.items,
              status: data.status,
              tableNumber: data.tableNumber,
              branch: data.branch,
              createdAt: data.createdAt, // Assuming createdAt is a Timestamp
              totalDiscount: data.totalDiscount, // Optional field
            };
          });

          // Sort orders by `createdAt` in descending order
          fetchedOrders.sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });

          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]); // Re-fetch when the user changes

  if (loading) {
    return (
      <div className="text-center text-lg text-gray-750 pb-[650px]">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground-primary mb-6">
          Your Order History
        </h2>
        Loading your order history...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground-primary mb-6">
        Your Order History
      </h2>

      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-white rounded-lg shadow-md p-4 md:p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  Order ID: {order.id}
                </h3>
                <p>
                  <span className="font-medium">Status:</span> {order.status}
                </p>
              </div>

              <div className="text-gray-700 mb-4">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt.toDate()).toLocaleString()
                    : "Invalid Date"}
                </p>
                <p>
                  <span className="font-medium">
                    Order No: {order.orderNumber}
                  </span>
                </p>

                <p>
                  <span className="font-medium">Table:</span>{" "}
                  {order.tableNumber}
                </p>
                <span className="text-sm md:text-base text-gray-600">
                  {order.dineInOrTakeout}
                </span>
              </div>

              <ul className="border-t border-gray-200 pt-4 space-y-2">
                {order.items.map((item: ItemCart, index: number) => (
                  <li key={index} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span> x{" "}
                      {item.quantity}
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              {/* Optional: Display total price and discount */}
              <div className="flex justify-end mt-4 text-gray-800">
                {order.totalDiscount && (
                  <p className="text-sm line-through mr-4">
                    ${order.totalDiscount.toFixed(2)}
                  </p>
                )}
                <p className="font-semibold">
                  {/* Calculate total price here */}Total:{" "}
                  {order.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 pb-[600px]">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
