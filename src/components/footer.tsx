import React from 'react'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '600'], // You can adjust weights as needed
  })
function Footer() {
  return (
    <div className={`bg-black text-white px-6 py-4 shadow-md sticky bottom-0 z-50 flex justify-center items-center ${poppins.className}`}>
    <div className=''>
      This is a full-stack e-commerce website built with Next.js, React, MongoDB, Mongoose, and Node.js.
    </div>
  </div>
  )
}

export default Footer
