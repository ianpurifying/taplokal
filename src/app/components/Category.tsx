import Link from 'next/link';
import React from 'react'

const Categoryitem = [
    {
        name: "Ramen",
        href: "/menu/ramen",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={100} height={100} fill={"none"}>
        <path d="M18 12C18 10.6193 16.8807 9.5 15.5 9.5C14.1193 9.5 13 10.6193 13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 3V12M8.5 2.5V7.5M11 2V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 4.5L6 4.1875M20 2L13.5 3.01562M4 7L6 6.875M20 6L13.5 6.40625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.91145 12H19.0886C20.6914 12 21.2786 12.3707 20.8787 13.9821C20.1733 16.8246 18.1759 17.5306 16.3304 19.3859C15.8819 19.8369 16.5798 20.5032 16.5802 20.9992C16.5809 21.933 15.6928 22 14.9854 22H9.0146C8.30717 22 7.41908 21.933 7.41982 20.9992C7.4202 20.5137 8.0972 19.8159 7.66957 19.3859C5.82407 17.5306 3.82674 16.8246 3.12128 13.9821C2.72136 12.3707 3.30857 12 4.91145 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
    },
    {
        name: "Breakfast Special",
        href: "/menu/breakfast special",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={100} height={100} fill={"none"}>
        <path d="M18.4998 3.00194L15.0604 6.44128C14.4746 7.02707 14.4746 7.97681 15.0604 8.5626L15.7498 9.25194M21.9998 6.50194L18.5604 9.94128C17.9746 10.5271 17.0249 10.5271 16.4391 9.94128L15.7498 9.25194M15.7498 9.25194L3.99976 21.0019" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 4.99902L17.5 7.49902" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.98914 8.99011C6.79472 10.1845 5.15674 10.4831 3.66377 8.99011C2.17075 7.49708 1.38801 4.77782 2.58243 3.5834C3.77685 2.38898 6.49611 3.17172 7.98914 4.66474C9.48211 6.15772 9.18356 7.79569 7.98914 8.99011ZM7.98914 8.99011L20 21.001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9.20542 2.39668C10.0923 2.13907 11.03 2.00097 12 2.00097C13.1517 2.00097 14.2579 2.19566 15.2876 2.55393M2.04937 11.001C2.01672 11.3299 2 11.6635 2 12.001C2 14.0328 2.60598 15.9231 3.64707 17.501M7.77267 21.0661C9.05671 21.6659 10.4892 22.001 12 22.001C13.5244 22.001 14.9691 21.6599 16.262 21.0499M20.3529 17.501C21.394 15.9231 22 14.0328 22 12.001C22 11.4228 21.9509 10.8561 21.8567 10.3048" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    },
    {
        name: "Hot Beverages",
        href: "/menu/hot beverages",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={100} height={100} fill={"none"}>
        <path d="M18.2505 10.5H19.6403C21.4918 10.5 22.0421 10.7655 21.9975 12.0838C21.9237 14.2674 20.939 16.8047 17 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.94627 20.6145C2.57185 18.02 2.07468 14.3401 2.00143 10.5001C1.96979 8.8413 2.45126 8.5 4.65919 8.5H15.3408C17.5487 8.5 18.0302 8.8413 17.9986 10.5001C17.9253 14.3401 17.4281 18.02 14.0537 20.6145C13.0934 21.3528 12.2831 21.5 10.9194 21.5H9.08064C7.71686 21.5 6.90658 21.3528 5.94627 20.6145Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11.3089 2.5C10.7622 2.83861 10.0012 4 10.0012 5.5M7.53971 4C7.53971 4 7 4.5 7 5.5M14.0012 4C13.7279 4.1693 13.5 5 13.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    },
    {
        name: "Cold Beverages",
        href: "/menu/cold beverages",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={100} height={100} fill={"none"}>
        <path d="M5 7L6.7602 17.4048C7.06616 19.2134 7.21914 20.1177 7.76007 20.7417C9.21438 22.4194 14.7856 22.4194 16.2399 20.7417C16.7809 20.1177 16.9338 19.2134 17.2398 17.4048L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 7L5.74278 5.2876C6.35168 3.88385 6.65613 3.18197 7.29101 2.7856C8.88049 1.79324 14.9452 1.68444 16.709 2.7856C17.3439 3.18197 17.6483 3.88385 18.2572 5.2876L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="12" cy="14.5" rx="2" ry="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    },
    {
        name: "Student Meal",
        href: "/menu/student meal",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={100} height={100} fill={"none"}>
        <path d="M17 13.2308C17 13.2308 16.0909 12.7693 15.1818 12.7693C13.8182 12.7693 12 14.6154 12 17.3846C12 20.1537 14.4896 22 17 22C19.5104 22 22 20.1537 22 17.3846C22 14.6154 20.1818 12.7693 18.8182 12.7693C17.9091 12.7693 17 13.2308 17 13.2308ZM17 13.2308C17 11.8462 17.9091 10 19.7273 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.655 5C11.5512 5 12.2778 4.32843 12.2778 3.5C12.2778 2.67157 11.5512 2 10.655 2H5.24561C4.34936 2 3.6228 2.67157 3.6228 3.5C3.6228 4.32843 4.34936 5 5.24561 5M11.1693 4.92311C12.1247 6.68943 12.9095 8.28337 13.3888 10C13.4279 10.1401 13.465 10.281 13.5 10.4229M10.428 22H6.32748C2.74721 22 2 21.3093 2 18V13.7771C2 10.3773 3.09757 7.88562 4.70467 4.91465" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    },
    {
        name: "Japanese Dish",
        href: "/menu/japanese dish",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={100} height={100} fill={"none"}>
        <path d="M11.0078 3C9.5913 7 7.06961 14 11.5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 5.31913C6.70588 6.19855 15.1765 6.63826 21 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.0034 10C16.4981 13 12.5403 19.5 7.15287 19.9565C0.934783 20.4834 4.62421 11 12.0451 11.5C18.2926 11.921 22.0322 16.8261 15.7923 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    },
    {
        name: "Inasal",
        href: "/menu/inasal",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={100} height={100} fill={"none"}>
        <path d="M10 15.8446L6.68575 19.1589C7.45757 19.7089 7.56154 20.8655 6.88551 21.5416C6.27426 22.1528 5.28323 22.1528 4.67198 21.5416C4.19008 21.0597 4.02512 20.2787 4.30305 19.6969C3.72125 19.9749 2.94033 19.8099 2.45844 19.328C1.84719 18.7168 1.84719 17.7257 2.45844 17.1145C3.13447 16.4385 4.29108 16.5424 4.84114 17.3142L8.15538 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12.5368 3.68189C14.8712 1.34751 18.1694 1.53315 20.3181 3.68189C22.033 5.39675 22.4975 7.8437 21.4285 9.94858C19.6533 7.59535 15.6579 9.39829 16.4055 12.3559C14.7572 11.6697 13.3426 13.7886 14.478 15.0632C12.0982 16.0318 9.73049 16.4381 8.64618 15.3538C6.49743 13.2051 10.2024 6.01628 12.5368 3.68189Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
    },
    {
        name: "Chicken Wings",
        href: "/menu/chicken wings",
        svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={100} height={100} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.435,24.364c-1.781,1.512-3.389,4.2-3.459,8.168c-0.007,0.378-0.267,0.696-0.634,0.772c-1.976,0.418-4.835,0.313-6.317-1.168
          c-0.313-0.313-0.813-0.367-1.166-0.118c-2.535,1.91-3.942,5.388-2.844,9.37c0.935,3.336,3.609,6.01,6.944,6.944
          c3.982,1.098,7.46-0.309,9.37-2.844c0.249-0.353,0.195-0.853-0.118-1.166c-1.48-1.481-1.586-4.341-1.168-6.317
          c0.076-0.367,0.394-0.627,0.772-0.634c3.968-0.07,6.656-1.678,8.168-3.459c2.359-2.781,3.588-6.626,3.781-9.795
          c0.005-0.103,0.014-0.208,0.021-0.312c0.112-1.656-0.003-3.288-0.315-4.836c-0.425-2.011-1.208-3.928-2.379-5.651
          c-1.482-2.225-3.455-4.067-5.67-5.319c-1.726-0.978-3.643-1.675-5.648-2.102c-1.574-0.325-3.196-0.446-4.823-0.356
          c-0.105,0.007-0.209,0.015-0.313,0.021c-3.17,0.193-7.014,1.422-9.795,3.781C16.083,16.768,13.276,21.274,20.435,24.364z"/>
        <path d="M43.565,24.364c1.781,1.512,3.389,4.2,3.459,8.168c0.007,0.378,0.267,0.696,0.634,0.772c1.976,0.418,4.835,0.313,6.317-1.168
          c0.313-0.313,0.813-0.367,1.166-0.118c2.535,1.91,3.942,5.388,2.844,9.37c-0.935,3.336-3.609,6.01-6.944,6.944
          c-3.982,1.098-7.46-0.309-9.37-2.844c-0.249-0.353-0.195-0.853,0.118-1.166c1.48-1.481,1.586-4.341,1.168-6.317
          c-0.076-0.367-0.394-0.627-0.772-0.634c-3.968-0.07-6.656-1.678-8.168-3.459c-2.359-2.781-3.588-6.626-3.781-9.795
          c-0.005-0.103-0.014-0.208-0.021-0.312c-0.112-1.656,0.003-3.288,0.315-4.836c0.425-2.011,1.208-3.928,2.379-5.651
          c1.482-2.225,3.455-4.067,5.67-5.319c1.726-0.978,3.643-1.675,5.648-2.102c1.574-0.325,3.196-0.446,4.823-0.356
          c0.105,0.007,0.209,0.015,0.313,0.021c3.17,0.193,7.014,1.422,9.795,3.781C47.917,16.768,50.724,21.274,43.565,24.364z"/>
      </svg>
      
      
    }
]

export const Category = () => {
    return (
        <>
            {Categoryitem.map((item, index) => (
                <Link href={item.href} key={index} className="bg-white hover:bg-foreground/20 shadow-lg text-foreground border items-center justify-center flex flex-col p-3 lg:p-5 rounded-xl">
                    {item.svg}
                    <h1 className="text-black/60 mt-5 text-center text-base lg:text-2xl font-semibold whitespace-nowrap">{item.name}</h1>
                </Link>
            ))}
        </>
    )
}

export default Category;
