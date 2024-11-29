"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CartItem from "../components/CartItem";
import { auth, fs } from "../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ItemCart } from "../Types";
import { onAuthStateChanged, User } from "firebase/auth";
import toast from "react-hot-toast";
import generateTransactionNumber from "../utils/generateTransactionNumber";
import Select from "react-select";

interface Table {
  tableNumber: number;
  status: string;
}

const Page = () => {
  const router = useRouter();
  const [dineInOrTakeout, setDineInOrTakeOut] = useState("dine in");
  const [cartItems, setCartItems] = useState<Array<ItemCart>>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cartId, setCartId] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<number>(0);
  const [tableOccupied, setTableOccupied] = useState<Table[]>();
  const selectRef = useRef(null);

  const retrieveTableOptions = () => {
    if (dineInOrTakeout === "takeout") {
      return [
        {
          value: 0,
          label: "Not Seated",
          disabled: false,
        },
      ];
    }
    return [
      { value: 0, label: "Choose table", disabled: false }, // Add `disabled`
      ...Array.from({ length: 25 }, (_, i) => ({
        value: i + 1,
        label: `Table ${i + 1}`,
        disabled: tableOccupied?.some((table) => table.tableNumber === i + 1),
      })),
    ];
  };

  useEffect(() => {
    const retrieveTableOccupied = async () => {
      const tablesCollection = collection(fs, "tables");
      const q = query(tablesCollection, where("status", "==", "occupied"));
      onSnapshot(q, (querySnapshot) => {
        const tables = querySnapshot.docs.map((doc) => doc.data());
        setTableOccupied(tables as Table[]);
        if (tables.some((table) => table.tableNumber === tableNumber)) {
          setTableNumber(0);
        }
      });
    };

    retrieveTableOccupied();
  }, [tableNumber]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};

    if (!user) return;
    const cartsCollectionRef = collection(fs, "carts");

    const q = query(cartsCollectionRef, where("customerId", "==", user!.uid));

    unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const cartDoc = querySnapshot.docs[0];
          setCartId(cartDoc.id);
          const items = cartDoc
            .data()
            .items.map((item: ItemCart, index: number) => {
              return {
                id: index,
                name: item.name,
                price: item.price,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                imageURL: item.imageURL || "",
              };
            });
          setCartItems(items);
        } else {
          router.push("/#");
        }
      },
      (error) => {
        console.error("Error fetching cart item count: ", error);
      }
    );

    return () => unsubscribe();
  }, [user, router]);

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast.dismiss();
    const button = e.currentTarget;
    button.disabled = true;

    if (dineInOrTakeout === "dine in" && tableNumber !== 0) {
      const tableRef = doc(fs, "tables", `table_${tableNumber}`);
      const tableDoc = await getDoc(tableRef);
      if (tableDoc.data()?.status === "occupied") {
        toast.error("Table is already occupied");
        return;
      }

      await setDoc(tableRef, {
        tableNumber: tableNumber,
        status: "occupied",
      });
    }

    if (!user) return;
    if (cartItems.length === 0) {
      toast.dismiss();
      toast.error("No items in cart");
      button.disabled = false;
      return;
    }

    try {
      const stockChecks = cartItems.map(async (item: ItemCart) => {
        const itemRef = doc(fs, "menu", item.menuItemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error(`Item ${item.name} does not exist`);
        }

        const currentStock = itemDoc.data()?.stock || 0;
        if (currentStock < item.quantity) {
          throw new Error(
            `Available stock for ${item.name} is ${currentStock}`
          );
        }

        await updateDoc(itemRef, {
          stock: currentStock - item.quantity,
        });
      });

      await Promise.all(stockChecks);

      await runTransaction(fs, async (transaction) => {
        const counterRef = doc(fs, "counters", "checkoutCounter");
        const counterDoc = await transaction.get(counterRef);
        let newOrderNumber;

        if (counterDoc.exists()) {
          const currentCount = counterDoc.data().count;
          newOrderNumber = currentCount + 1;
          transaction.update(counterRef, { count: increment(1) });
        } else {
          newOrderNumber = 1000;
          transaction.set(counterRef, { count: 1000 });
        }

        const checkoutsCollectionRef = collection(fs, "checkouts");
        const transactionNumber = generateTransactionNumber(newOrderNumber);
        await addDoc(checkoutsCollectionRef, {
          customerId: user.uid,
          items: cartItems,
          status: "pending",
          tableNumber: tableNumber,
          transactionNumber: transactionNumber,
          dineInOrTakeout: dineInOrTakeout,
          createdAt: new Date(),
          orderNumber: newOrderNumber,
        });

        const cartRef = doc(fs, "carts", cartId);
        transaction.update(cartRef, { items: [] });
        toast.success("Checkout successful!");
        router.push(`/checkout/${newOrderNumber}`);
      });
    } catch (error) {
      toast.error(
        "Checkout failed. Please try again. " + (error as Error).message
      );
    } finally {
      button.disabled = false;
    }
  };

  return (
    <div className="py-10 lg:py-20 min-h-screen px-2 lg:px-40">
      <h1 className="text-center mt-10 text-5xl font-bold text-black">
        ORDER BAG
      </h1>
      <div className="flex justify-between mt-5 items-center">
        <h2 className="text-lg lg:text-3xl font-bold uppercase">My Order</h2>
        <div className="bg-white drop-shadow-sm flex flex-row w-52 rounded-full overflow-hidden">
          <button
            onClick={() => setDineInOrTakeOut("dine in")}
            className={`${
              dineInOrTakeout === "dine in"
                ? "bg-foreground/20 text-foreground"
                : "text-foreground"
            } py-2 rounded-full w-full`}
          >
            Dine In
          </button>
          <button
            onClick={() => setDineInOrTakeOut("takeout")}
            className={`${
              dineInOrTakeout === "takeout"
                ? "bg-foreground/20 text-foreground"
                : "text-foreground"
            } py-2 rounded-full w-full`}
          >
            Take Out
          </button>
        </div>
      </div>
      {cartItems.map((item, index) => (
        <CartItem key={index} items={item} cartId={cartId} />
      ))}
      <div className="flex justify-end mt-5 items-center text-black">
        {dineInOrTakeout === "dine in" ? (
          <Select
            className="w-52"
            options={retrieveTableOptions().filter(
              (option) => option.value !== 0
            )} // Exclude "Choose table" from options
            onChange={(selectedOption) =>
              setTableNumber(selectedOption?.value || 0)
            }
            isOptionDisabled={(option) => !!option.disabled}
            value={retrieveTableOptions().find(
              (option) => option.value === tableNumber
            )}
            ref={selectRef}
            isSearchable={false}
            placeholder="Choose table"
            styles={{
              control: (base) => ({
                ...base,
                cursor: "pointer",
              }),
              option: (base) => ({
                ...base,
                cursor: "pointer",
              }),
            }}
          />
        ) : (
          <span className="w-52 text-center text-black bg-white-700 border-2 border-black-100 rounded-md py-2 font-semibold">
            Not Seated
          </span>
        )}
      </div>

      <div>
        <div className="flex justify-between mt-5">
          <h2 className="text-lg lg:text-3xl font-bold uppercase">Total</h2>
          <h2 className="text-lg lg:text-3xl font-bold uppercase">
            ₱
            {cartItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
            .00
          </h2>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-foreground text-white px-5 py-2 rounded-lg w-full mt-5"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Page;
