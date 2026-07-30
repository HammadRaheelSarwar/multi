import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, index = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search?category=${category.slug}`);
  };

  // UstadHub palette — teal/champagne/navy accents
  const palettes = [
    { bg: 'bg-[#e7eeff]', icon: 'text-[#006a63]', text: 'text-[#131c2a]', border: 'border-[rgba(0,106,99,0.15)]' },
    { bg: 'bg-[#fdf3e0]', icon: 'text-[#a07f3c]', text: 'text-[#131c2a]', border: 'border-[rgba(233,193,120,0.25)]' },
    { bg: 'bg-[#f0f3ff]', icon: 'text-[#565d79]', text: 'text-[#131c2a]', border: 'border-[rgba(86,93,121,0.15)]' },
    { bg: 'bg-[#e6f7f6]', icon: 'text-[#006a63]', text: 'text-[#131c2a]', border: 'border-[rgba(0,106,99,0.15)]' },
    { bg: 'bg-[#fff4e8]', icon: 'text-[#a07f3c]', text: 'text-[#131c2a]', border: 'border-[rgba(233,193,120,0.2)]' },
    { bg: 'bg-[#eef0ff]', icon: 'text-[#3e4660]', text: 'text-[#131c2a]', border: 'border-[rgba(62,70,96,0.12)]' },
  ];

  const palette = palettes[index % palettes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.04, y: -3 }}
      onClick={handleClick}
      className="cursor-pointer group"
    >
      <div className={`${palette.bg} border ${palette.border} rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 hover:shadow-md`}>
        <div className={`text-4xl ${palette.icon} transition-transform duration-200 group-hover:scale-110`}>
          {category.icon || '🏢'}
        </div>
        <span className={`text-xs font-bold ${palette.text} text-center leading-tight`} style={{ fontFamily: "'Inter', sans-serif" }}>
          {category.name}
        </span>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
