"use client";
import { fs } from "@/app/firebaseConfig";
import { Item } from "../../Types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Popular from "@/app/components/Popular";

const Page = ({ params }: { params: { category: string } }) => {
  const [popularItems, setPopularItems] = useState<Array<Item>>([]);

  const normalizeCategory = (category: string) => {
    return (
      category.replace(/%20/g, " ").charAt(0) +
      category.replace(/%20/g, " ").slice(1).toLowerCase()
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const normalizedCategory = normalizeCategory(params.category);
      console.log(normalizeCategory);
      const menuCollection = collection(fs, "menu");
      const querySnapshot = await getDocs(
        query(
          menuCollection,
          where("category", "==", normalizedCategory),
          orderBy("sold", "desc")
        )
      );
      const topSoldItems = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          sold: data.sold,
          stock: data.stock,
          name: data.name,
          description: data.description,
          imageURL: data.imageURL,
          price: data.price,
        } as Item;
      });
      setPopularItems(topSoldItems);
    };

    fetchData();
  }, [params.category]);
  return (
    <div className="py-10 lg:py-20 min-h-screen">
      <h1 className="text-center mt-10 text-5xl font-bold text-black">
        TAPLOKAL MENU
      </h1>
      <h2 className="text-3xl font-semibold mt-5 uppercase">
        {normalizeCategory(params.category)}
      </h2>
      <div className="grid lg:grid-cols-3 gap-5 mt-5 px-6 lg:px-0">
        {popularItems.map((item, index) => (
          <Popular key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Page;
