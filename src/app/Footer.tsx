import React from 'react'
import Image from 'next/image'
import icon from './icon.png'

const Footer = () => {
    return (
        <footer className="bg-background w-full">
            <div className="py-4 md:py-8">
                <div className="flex justify-between items-start">
                    <a href="/" className="flex mb-4 sm:mb-0 space-x-1 lg:space-x-3 rtl:space-x-reverse">
                        <Image src={icon} alt="Taplokal" className='w-12 h-12' />
                        <span className="self-center text-sm lg:text-2xl font-semibold whitespace-nowrap">TapLokal</span>
                    </a>
                    <ul className="flex flex-col justify-right items-end mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <h1 className="hover:underline me-4 md:me-6 text-base lg:text-lg">Contact Us</h1>
                        </li>
                        <li>
                            <a href="mailto:Taplokalmainemail@gmail.com" className="hover:underline me-4 md:me-6 text-xs lg:text-base">Taplokalmainemail@gmail.com</a>
                        </li>
                        <li>
                            <a href="tel+:639-123-456-789" className="hover:underline me-4 md:me-6 text-xs lg:text-base">639-123-456-789</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-2 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-center text-black/60">© 2024 <a href="/" className="hover:underline">TapLokal</a>. All Rights Reserved.</span>
            </div>
        </footer>


    )
}

export default Footer