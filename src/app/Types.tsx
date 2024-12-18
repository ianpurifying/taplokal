import { Timestamp } from "firebase/firestore";

export interface Item {
  id: string;
  sold: number;
  stock: number;
  name: string;
  description: string;
  price: number;
  imageURL: string;
}

export interface ItemCart {
  id: string;
  name: string;
  price: number;
  quantity: number;
  menuItemId: string;
  imageURL: string;
}

// Assuming Checkout is not used here, but if it is, the interface can be updated similarly
export interface Checkout {
  cartId: string;
  customerId: string;
  orderNumber: number;
  transactionNumber: string;
  dineInOrTakeout: string;
  items: ItemCart[];
  status: string;
  tableNumber: number;
}

export interface CartDetails {
  id: string; // Added the id property
  branch: string;
  cartId: string;
  createdAt: Timestamp;
  customerId: string;
  dineInOrTakeout: string;
  items: ItemCart[];
  orderNumber: number;
  status: string;
  tableNumber: number;
  totalDiscount?: number;
}
