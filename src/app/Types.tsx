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