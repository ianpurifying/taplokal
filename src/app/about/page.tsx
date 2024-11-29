import React from 'react';

export default function Page() {

  return (
    <div className="py-10 lg:py-20 h-screen flex flex-col gap-8 text-center text-black/60">
      <h1 className='text-3xl font-bold mt-10 text-foreground'>About Us</h1>
      <p>
        Welcome to TapLokal! We are here to enhance your dining experience by making it easier than ever to order food directly from your table at your favorite local restaurants. Our app allows you to browse the full menu, customize your order, and place it directly with the kitchen—all from your smartphone or tablet.
      </p>
      <p>
        With TapLokal, there&apos;s no need to wait for a server to take your order. Simply scan the QR code at your table, explore the restaurant&apos;s offerings, and place your order at your own pace. Whether you&apos;re craving a classic dish or looking to try something new, TapLokal makes the ordering process seamless and efficient.
      </p>
      <p>
        Our app is designed to support local restaurants by streamlining their in-house ordering process, reducing wait times, and enhancing customer satisfaction. By using TapLokal, you&apos;re not just ordering food—you&apos;re enjoying a more personalized and interactive dining experience.
      </p>
      <p>
        Join us in transforming the way you dine out. Download TapLokal and make your next restaurant visit smoother and more enjoyable!
      </p>
      <hr />
      <p>This version focuses on the web&apos;s functionality within restaurants and highlights the benefits for both customers and businesses.</p>
    </div>
  );
}
