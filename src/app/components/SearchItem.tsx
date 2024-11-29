import React from 'react';
import { Item } from '../Types';
import Image from 'next/image';
import { collection, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { auth, fs } from '../firebaseConfig';

const SearchItem = ({ item }: { item: Item }) => {
    
    const addToCart = async () => {
        try {
          const customerId = auth.currentUser?.uid;
      
          if (!customerId) {
            toast.error("Please log in to add items to the cart.");
            return;
          }
      
          const cartsCollectionRef = collection(fs, 'carts');
          const q = query(cartsCollectionRef, where("customerId", "==", customerId), where("status", "==", "cart"));
          const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
            const cartDoc = querySnapshot.docs[0];
            const cartData = cartDoc.data();
      
            // Check if the item already exists in the cart
            const existingItemIndex = cartData.items.findIndex((cartItem: { menuItemId: string; }) => cartItem.menuItemId === item.id);
      
            if (existingItemIndex >= 0) {
              // Item exists, update its quantity
              const updatedItems = cartData.items.map((cartItem: { quantity: number; }, index: number) => {
                if (index === existingItemIndex) {
                  return {
                    ...cartItem,
                    quantity: cartItem.quantity + 1, // Increment the quantity
                  };
                }
                return cartItem;
              });
      
              await updateDoc(cartDoc.ref, {
                items: updatedItems,
                // No need to update subtotal, total, etc. here
              });
            } else {
              // Item doesn't exist, add a new item to the cart
              await updateDoc(cartDoc.ref, {
                items: [
                  ...cartData.items,
                  {
                    menuItemId: item.id,
                    name: item.name,
                    quantity: 1,
                    price: item.price,
                    imageURL: item.imageURL,
                  },
                ],
                // No need to update subtotal, total, etc. here
              });
            }
          } else {
            // Create a new cart if one doesn't exist
            const newCartRef = doc(cartsCollectionRef);
      
            await setDoc(newCartRef, {
              cartId: newCartRef.id,
              customerId: customerId,
              status: 'cart',
              items: [{
                menuItemId: item.id,
                name: item.name,
                quantity: 1,
                price: item.price,
                imageURL: item.imageURL,
              }],
              // No need to set subtotal, tax, total, createdAt, updatedAt here
            });
          }
      
          toast.success("Item added: " + item.name);
        } catch (error) {
          toast.error("Error adding item to cart: " + error);
        }
      };

    return (
        <div onClick={addToCart} className='flex cursor-pointer items-center p-4 border-b border-gray-200 hover:bg-gray-100 transition duration-150 ease-in-out'>
            <Image src={item.imageURL} alt={item.name} width={50} height={50} className="rounded-full mr-4" />
            <div className="search-item-details flex-1">
                <h2 className="search-item-name text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                    {item.description && item.description.length > 20 
                        ? item.description.substring(0, 20) + '...' 
                        : item.description || 'No description available'}
                </p>
                <p className="search-item-price text-green-500 font-bold">₱{item.price}.00</p>
            </div>
        </div>
    );
}

export default SearchItem;
