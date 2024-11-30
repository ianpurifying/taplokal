import React from "react";
import Image from "next/image";
import { ItemCart } from "../Types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fs } from "../firebaseConfig";

const CartItem = ({ items, cartId }: { items: ItemCart; cartId: string }) => {
  const handleIncrement = async () => {
    const updatedItem = { ...items, quantity: items.quantity + 1 };
    await updateItemInFirestore(updatedItem);
  };

  const handleDecrement = async () => {
    if (items.quantity > 1) {
      const updatedItem = { ...items, quantity: items.quantity - 1 };
      await updateItemInFirestore(updatedItem);
    } else {
      await removeItemFromFirestore();
    }
  };

  const updateItemInFirestore = async (updatedItem: ItemCart) => {
    const cartRef = doc(fs, "carts", cartId);
    const cartDoc = await getDoc(cartRef);
    const cartData = cartDoc.data();
    if (!cartData) {
      console.error("Cart data is undefined");
      return;
    }
    const updatedItems = cartData.items.map((i: ItemCart) =>
      i.menuItemId === items.menuItemId ? updatedItem : i
    );
    await updateDoc(cartRef, { items: updatedItems.filter(Boolean) });
  };

  const removeItemFromFirestore = async () => {
    const cartRef = doc(fs, "carts", cartId);
    const cartDoc = await getDoc(cartRef);
    const cartData = cartDoc.data();
    if (!cartData) {
      console.error("Cart data is undefined");
      return;
    }
    // Filter out the item with the matching menuItemId
    const updatedItems = cartData.items.filter(
      (i: ItemCart) => i.menuItemId !== items.menuItemId
    );
    await updateDoc(cartRef, { items: updatedItems.filter(Boolean) });
  };
  return (
    <div>
      <div className="flex justify-between items-center mt-5">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-foreground rounded-lg relative">
            <Image
              src={items.imageURL}
              alt={items.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="ml-5">
            <h2 className="text-lg font-semibold">{items.name}</h2>
            <p className="text-sm">
              Rice, anchovies, peanuts, egg, cucumber, sambal
            </p>
            <p className="text-sm">x{items.quantity}</p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-lg font-semibold">
            ₱{items.price * items.quantity}.00
          </p>
          <button
            onClick={handleDecrement}
            className="ml-5 bg-foreground text-white px-2 py-1 rounded-lg"
          >
            -
          </button>
          <button
            onClick={handleIncrement}
            className="ml-2 bg-foreground text-white px-2 py-1 rounded-lg"
          >
            +
          </button>
        </div>
      </div>
      <hr className="my-5" />
    </div>
  );
};

export default CartItem;
