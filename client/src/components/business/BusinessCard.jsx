import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Heart, ArrowRight, Zap } from 'lucide-react';

const BusinessCard = ({ business }) => {
  const navigate = useNavigate();

  if (!business) return null;

  const {
    name,
    slug,
    logo,
    coverImages,
    address,
    category,
    ratingAverage,
    reviewCount,
    isVerified,
    verificationLevel,
    isFeatured,
    description,
  } = business;

  const coverImage = coverImages && coverImages.length > 0
    ? coverImages[0]
    : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80';

  const handleClick = () => navigate(`/business/${slug}`);

  return (
    <div
      onClick={handleClick}
      className="uh-expert-card group"
    >
      {/* Image section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-[#e9c178] text-[#131c2a] text-xs font-bold rounded-full shadow-lg">
            <Zap size={10} fill="#131c2a" />
            Featured
          </div>
        )}

        {/* Rating badge */}
        {ratingAverage > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
            <Star size={11} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-[#131c2a]">{ratingAverage.toFixed(1)}</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          style={{ display: ratingAverage > 0 ? 'none' : 'flex' }}
        >
          <Heart size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Name + Verified */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-[#131c2a] dark:text-gray-100 text-base leading-tight line-clamp-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {name}
          </h3>
          {isVerified && (
            <ShieldCheck
              size={16}
              className={`shrink-0 mt-0.5 ${
                verificationLevel === 'gold' ? 'text-amber-500' :
                verificationLevel === 'silver' ? 'text-slate-400' :
                verificationLevel === 'premium' ? 'text-purple-500' : 'text-[#006a63]'
              }`}
            />
          )}
        </div>

        {/* Category */}
        {category && (
          <div className="text-xs font-semibold text-[#006a63] mb-2">
            {category.icon} {category.name}
          </div>
        )}

        {/* Description excerpt */}
        {description && (
          <p className="text-xs text-[#45464d] dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Location */}
        {address?.city && (
          <div className="flex items-center gap-1 text-xs text-[#76767e] mb-3">
            <MapPin size={11} />
            <span>{address.city}{address.state ? `, ${address.state}` : ''}</span>
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(198,198,206,0.35)]">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-[#131c2a] dark:text-gray-200">
              {ratingAverage ? ratingAverage.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-[#76767e]">({reviewCount || 0})</span>
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-[#006a63] hover:gap-2 transition-all">
            View Profile <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
