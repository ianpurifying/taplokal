import React from 'react'

const page = ({ params }: { params: { orderno: string } }) => {
  return (
    <div className="py-10 lg:py-20 min-h-screen text-center">
        <h1 className='mt-20 text-6xl lg:text-8xl font-bold mb-10'>Thank You For Your Purchased</h1>
        <p className='text-xl'>please take note of your order number</p>
        <h2 className='text-4xl font-bold my-5 uppercase text-black'>{params.orderno}</h2>
        <p className='text-xl'>and proceed to counter</p>
    </div>
  )
}

export default page