import React from "react";
import Link from "next/link"; // Import for navigation

const page = ({ params }: { params: { orderno: string } }) => {
  return (
    <div className="py-10 lg:py-20 min-h-screen text-center">
      {/* Another Order Button */}
      <div>
        <h1 className="mt-20 text-6xl lg:text-8xl font-bold mb-10">
          Thank You For Your Purchase
        </h1>
        <p className="text-xl">Please take note of your order number</p>
        <h2 className="text-4xl font-bold my-5 uppercase text-black">
          {params.orderno}
        </h2>
        <p className="text-xl">and proceed to the counter</p>
      </div>
      <div className="flex justify-center mt-5">
        <Link
          href="/#categories"
          className="bg-foreground text-white px-5 py-2 rounded-lg hover:bg-foreground/80"
        >
          Order Again
        </Link>
      </div>
      {/* Main Content */}
    </div>
  );
};

export default page;
