'use client'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bebas_Neue } from "next/font/google";


const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});


const TypingText = () => {
    const fullTextArray = [
      "You", "can", "search", "for", "different", "products", "such", "as",
      "Makeup,", "Games,", "Shoes,", "Facewash,", "etc."
    ]
  
    const [displayedText, setDisplayedText] = useState('')
    const [index, setIndex] = useState(0)
  
    useEffect(() => {
      if (index < fullTextArray.length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + (prev ? ' ' : '') + fullTextArray[index])
          setIndex(index + 1)
        }, 300) // typing delay per word
  
        return () => clearTimeout(timeout)
      }
    }, [index])

  return (
    <motion.div
      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide text-center max-w-5xl mx-auto px-4 pt-12 ${bebas.className} p-3`}
    >
      <div className="bg-gray-800 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg inline-block">
        <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent whitespace-pre-wrap">
          {displayedText}
        </span>
      </div>
    </motion.div>
  );
};

export default TypingText;