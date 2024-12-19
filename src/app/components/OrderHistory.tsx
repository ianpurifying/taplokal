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
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Your Order History
      </h2>

      {orders.length > 0 ? (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-700">
                  Order ID: <span className="text-primary">{order.id}</span>
                </h3>
                <p className="text-sm md:text-base bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  <span className="font-medium">Status:</span> {order.status}
                </p>
              </div>

              <div className="text-gray-600 mb-6 space-y-2">
                <p className="text-sm md:text-base">
                  <span className="font-medium">Date:</span>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt.toDate()).toLocaleString()
                    : "Invalid Date"}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Order No:</span>{" "}
                  {order.orderNumber}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Table:</span>{" "}
                  {order.tableNumber}
                </p>
                <span className="block text-xs md:text-sm italic text-gray-500">
                  {order.dineInOrTakeout}
                </span>
              </div>

              <ul className="border-t border-gray-200 pt-4 space-y-3">
                {order.items.map((item: ItemCart, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm md:text-base text-gray-700"
                  >
                    <div>
                      <span className="font-semibold">{item.name}</span> x{" "}
                      {item.quantity}
                    </div>
                    <span className="text-primary">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center mt-6 text-gray-800">
                {order.totalDiscount && (
                  <p className="text-sm md:text-base text-gray-400 line-through">
                    ₱{order.totalDiscount.toFixed(2)}
                  </p>
                )}
                <p className="text-lg md:text-xl font-bold text-primary">
                  Total: ₱
                  {order.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 text-lg md:text-xl py-32">
          No orders found.
        </p>
      )}
    </div>
  );
};

export default OrderHistory;
