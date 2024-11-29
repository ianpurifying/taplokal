"use client";
import React from 'react';
import Lottie from 'lottie-react'; // Make sure this package is installed
import loader from './json/loader.json'; // Check the path to your loader.json file

function Loading() {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white z-50'>
      <Lottie
        animationData={loader}
        loop={true}
      />
    </div>
  );
}

export default Loading;
