import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick }) => {
  const baseClasses = 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-all duration-200';
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-700 cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
