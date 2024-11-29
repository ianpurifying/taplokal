"use client"
import Image from "next/image";
import ramen from "./images/ramen2.png";
import Category from "./components/Category";
import Popular from "./components/Popular";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Item } from "./Types";
import { fs } from "./firebaseConfig";

const servicesItems = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-8 lg:size-8" fill={"none"}>
    <path d="M16 6.5C15.9377 4.78752 15.7251 3.75009 14.9988 3.02513C13.9718 2 12.3188 2 9.01289 2C5.70698 2 4.05403 2 3.02701 3.02513C2 4.05025 2 5.70017 2 9V15C2 18.2998 2 19.9497 3.02701 20.9749C4.05403 22 5.70698 22 9.01289 22C12.3188 22 13.9718 22 14.9988 20.9749C15.7251 20.2499 15.9377 19.2125 16 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 19H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 11.9908L16 11.9998M20.0483 16.4912C21.2541 15.3396 22 13.7486 22 11.9912C22 10.2339 21.2541 8.64286 20.0483 7.49121M18 9.74121C18.6029 10.317 18.9759 11.1125 18.9759 11.9912C18.9759 12.8699 18.6029 13.6654 18 14.2412" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 2L6.089 2.53402C6.28188 3.69129 6.37832 4.26993 6.77519 4.62204C7.18918 4.98934 7.77614 5 9 5C10.2239 5 10.8108 4.98934 11.2248 4.62204C11.6217 4.26993 11.7181 3.69129 11.911 2.53402L12 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
</svg>,
    title1: "Order at",
    title2: "Online"
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-8 lg:size-8" fill={"none"}>
    <path d="M14 3H10C6.22876 3 4.34315 3 3.17157 4.17157C2 5.34315 2 7.22876 2 11C2 14.7712 2 16.6569 3.17157 17.8284C4.34315 19 6.22876 19 10 19H14C17.7712 19 19.6569 19 20.8284 17.8284C22 16.6569 22 14.7712 22 11C22 7.22876 22 5.34315 20.8284 4.17157C19.6569 3 17.7712 3 14 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 19L19 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 19L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>,
    title1: "Order at",
    title2: "Kiosk"
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-8 lg:size-8" fill={"none"}>
    <path d="M16.6667 14L7.33333 14C5.14718 14 4.0541 14 3.27927 14.5425C2.99261 14.7433 2.74327 14.9926 2.54254 15.2793C2 16.0541 2 17.1472 2 19.3333C2 20.4264 2 20.9729 2.27127 21.3604C2.37164 21.5037 2.4963 21.6284 2.63963 21.7287C3.02705 22 3.57359 22 4.66667 22L19.3333 22C20.4264 22 20.9729 22 21.3604 21.7287C21.5037 21.6284 21.6284 21.5037 21.7287 21.3604C22 20.9729 22 20.4264 22 19.3333C22 17.1472 22 16.0541 21.4575 15.2793C21.2567 14.9926 21.0074 14.7433 20.7207 14.5425C19.9459 14 18.8528 14 16.6667 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 14L19.593 10.3374C19.311 7.79863 19.1699 6.52923 18.3156 5.76462C17.4614 5 16.1842 5 13.6297 5L10.3703 5C7.81585 5 6.53864 5 5.68436 5.76462C4.83009 6.52923 4.68904 7.79862 4.40695 10.3374L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11.5 2H14M16.5 2H14M14 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 17.5L9.99615 18.1641C10.3247 18.3831 10.7107 18.5 11.1056 18.5H12.8944C13.2893 18.5 13.6753 18.3831 14.0038 18.1641L15 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 8H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg>,
    title1: "Order at",
    title2: "Cashier"
  },
]

export default function Home() {

  const [popularItems, setPopularItems] = useState<Array<Item>>([])

  const fetchData = async () => {
    const menuCollection = collection(fs, "menu");
    const querySnapshot = await getDocs(query(menuCollection, orderBy("sold", "desc"), limit(4)));
    const topSoldItems = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sold: data.sold,
        stock: data.stock,
        name: data.name,
        description: data.description,
        imageURL: data.imageURL,
        price: data.price
      } as Item;
    });
    setPopularItems(topSoldItems);
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="py-10 lg:py-20">
      <main className="mt-10 flex lg:flex-row flex-col-reverse items-center">
        <div className="flex flex-col gap-8 lg:w-3/5">
          <h1 className="text-6xl text-center lg:text-left lg:text-8xl text-black font-extrabold max-w-xl">TONKUTSU <br />RAMEN</h1>
          <p className="max-w-lg text-black/70 text-xl">Delicious Meals, Just a Click Away – Order Now for Flavorful and Convenient Dining!</p>
          <a href="/#categories" className="w-max py-2 px-8 bg-foreground hover:bg-foreground/60 rounded-xl text-white">Order Now</a>
        </div>
        <div className="lg:w-2/5 p-0">
          <Image className="w-full h-full drop-shadow-2xl" src={ramen} alt="logo" />
        </div>

      </main>
      <section id="categories" className="mt-10 pt-10 lg:mt-20">
        <h1 className="text-center text-3xl font-bold text-black">Our Special Dishes</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-12 mt-20">
          <Category />
        </div>
      </section>
      <section className="mt-10 pt-10 lg:mt-20 h-full w-full">
        <h1 className="text-center text-3xl font-bold text-black">Popular Food Items</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 w-full px-6 lg:px-0 pt-10">
          {popularItems.map((item, index)=> (
            <Popular key={index} item={item} />
          ))}
        </div>
      </section>
      <section className="mt-10 pt-10">
        <h1 className="text-black text-3xl font-bold my-5">Our Services</h1>
        <div className="flex flex-wrap gap-2 lg:gap-8">
          {servicesItems.map((item, index) => (
            <div key={index} className="p-4 gap-3 w-44 lg:w-52 bg-white hover:bg-foreground/10 drop-shadow-lg border rounded-lg flex items-center text-foreground">
              {item.icon}
              <div className="text-black/60 font-semibold text-xs lg:text-base">
                <h1>{item.title1} {item.title2}</h1>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
