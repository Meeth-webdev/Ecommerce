import { motion } from 'framer-motion'
const Spinner = () => (
    <motion.div
      className="w-5 h-5 border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    />
  );
  export default Spinner