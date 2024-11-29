import Image from "next/image";
import { Item } from "../Types";
import { auth, fs } from "../firebaseConfig"; // Ensure to import your Firestore instance
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

const Popular = ({ item }: { item: Item }) => {

  const { id, name, description, imageURL, price, stock } = item;

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
        const existingItemIndex = cartData.items.findIndex((cartItem: { menuItemId: string; }) => cartItem.menuItemId === id);

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
                menuItemId: id,
                name: name,
                quantity: 1,
                price: price,
                imageURL: imageURL,
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
            menuItemId: id,
            name: name,
            quantity: 1,
            price: price,
            imageURL: imageURL,
          }],
          // No need to set subtotal, tax, total, createdAt, updatedAt here
        });
      }

      toast.success("Item added: " + name);
    } catch (error) {
      toast.error("Error adding item to cart: " + error);
    }
  };


  return (
    <div key={id} className='w-full bg-background hover:bg-foreground/20 border rounded-xl overflow-hidden drop-shadow-xl border-none relative pb-20'>
      <div className="relative w-full h-0 pb-[100%]">
        {stock === 0 && <div className="absolute top-0 left-0 w-full h-full bg-black text-white bg-opacity-50 z-50 flex justify-center items-center">Out of Stock</div>}
        <Image className="w-full h-80 object-cover lg:h-72" src={imageURL} alt="logo" width={300} height={300} />
      </div>
      <div className="p-4">
        <h2 className="text-3xl font-semibold capitalize">{name}</h2>
        <p className="italic mt-5 text-black/70 text-sm">{description}</p>
        <div className="flex justify-between items-center absolute bottom-0 left-0 w-full px-4 py-2">
          <h1 className="text-xl font-bold">₱{price}.00</h1>
          <button disabled={stock == 0} onClick={addToCart} className="w-max py-2 px-8 bg-foreground hover:bg-foreground/60 rounded-xl text-white">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Popular;
