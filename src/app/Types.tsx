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
