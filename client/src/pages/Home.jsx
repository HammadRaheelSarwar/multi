import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, Clock, Shield, CheckCircle, Sparkles, Briefcase, Store } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import CategoryCard from '../components/business/CategoryCard';
import BusinessCard from '../components/business/BusinessCard';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from '../hooks/useAuth';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' } }),
};

// Featured service mini-cards for hero
const HERO_SERVICES = [
  { label: 'Home Cleaning', from: 'From $49', emoji: '🧹' },
  { label: 'Electrical Work', from: 'From $59', emoji: '⚡' },
  { label: 'Plumbing', from: 'From $69', emoji: '🔧' },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [homeFeed, setHomeFeed] = useState({
    featuredBusinesses: [],
    popularCategories: [],
    recentBusinesses: [],
    topRatedBusinesses: [],
    trendingServices: [],
    latestReviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = () => {
      api.get('/marketplace/home')
        .then((r) => {
          if (r.data.success) setHomeFeed(r.data.data || {});
        })
        .catch(() => setHomeFeed({ featuredBusinesses: [], popularCategories: [], recentBusinesses: [], topRatedBusinesses: [], trendingServices: [], latestReviews: [] }))
        .finally(() => setLoading(false));
    };

    fetchFeed();

    const socket = getSocket();
    socket.on('business:created', fetchFeed);
    socket.on('business:updated', fetchFeed);
    socket.on('service:created', fetchFeed);
    socket.on('review:created', fetchFeed);

    return () => {
      socket.off('business:created', fetchFeed);
      socket.off('business:updated', fetchFeed);
      socket.off('service:created', fetchFeed);
      socket.off('review:created', fetchFeed);
    };
  }, []);

  const handleSearch = ({ query, city, latitude, longitude }) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (city) params.set('city', city);
    if (latitude) params.set('latitude', latitude);
    if (longitude) params.set('longitude', longitude);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="overflow-x-hidden">

      {/* ─────────────── HERO SECTION ─────────────── */}
      <section className="relative min-h-[780px] pt-24 pb-20 flex items-center overflow-hidden z-0"
        style={{ background: 'linear-gradient(135deg,#071426 0%,#0d1e35 55%,#071426 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#006a63]/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#e9c178]/10 rounded-full blur-[80px] -z-10" />

        {/* Dot-grid overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Right hero image */}
        <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-[380px] h-[500px]">
          {/* Glowing ring */}
          <div className="absolute inset-[-20px] rounded-[46%] border-2 border-[#e9c178]/30 animate-pulse" />
          <div className="absolute inset-0 rounded-[44%] border border-[#006a63]/40" />
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=85"
            alt="Trusted UstadHub Professional"
            className="w-full h-full rounded-[44%] object-cover opacity-90 border-2 border-[#e9c178]/20"
          />
          {/* Floating stat cards */}
          <div className="absolute -top-6 -left-8 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg">⭐</div>
            <div>
              <div className="text-xs font-semibold text-[#45464d]">Top Rated</div>
              <div className="text-sm font-bold text-[#131c2a]">4.9/5 ★</div>
              <div className="text-[10px] text-[#76767e]">(2.3k reviews)</div>
            </div>
          </div>
          {HERO_SERVICES.map((s, i) => (
            <div key={s.label}
              className="absolute bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-xl flex items-center gap-2 text-left"
              style={{ bottom: `${i * 80 + 10}px`, left: i % 2 === 0 ? '-90px' : 'auto', right: i % 2 === 1 ? '-80px' : 'auto' }}
            >
              <span className="text-xl">{s.emoji}</span>
              <div>
                <div className="text-xs font-bold text-[#131c2a]">{s.label}</div>
                <div className="text-[10px] font-semibold text-[#006a63]">{s.from}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 w-full">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl space-y-6">

            {/* Tag pill */}
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-white/10 border border-[#e9c178]/40 text-[#e9c178] backdrop-blur">
                <Sparkles size={13} /> UstadHub — Book Smart. Live Easy.
              </span>
            </motion.div>

            {/* Auth welcome */}
            {isAuthenticated && user && (
              <motion.div variants={fadeUp} custom={0.5}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-4 py-3"
              >
                <div className="text-xl">{user.role === 'business_owner' ? '💼' : '👤'}</div>
                <div>
                  <div className="text-sm font-bold text-white">Welcome back, {user.fullName?.split(' ')[0]}!</div>
                  <div className="text-xs text-white/60 mt-0.5">
                    {user.role === 'business_owner' ? 'Service Provider Account' : 'Customer Account'}
                  </div>
                </div>
                <button
                  onClick={() => navigate(user.role === 'business_owner' ? '/business/profile' : '/search')}
                  className="ml-2 px-3 py-1.5 bg-[#e9c178] text-[#131c2a] text-xs font-bold rounded-xl hover:bg-[#f0cf8a] transition-colors flex items-center gap-1"
                >
                  {user.role === 'business_owner' ? 'Dashboard' : 'Browse'} <ArrowRight size={11} />
                </button>
              </motion.div>
            )}

            {/* Headline */}
            <motion.h1 variants={fadeUp} custom={1}
              className="text-4xl sm:text-5xl md:text-[68px] font-extrabold text-white leading-[1.02] tracking-[-0.04em]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Discover Trusted<br />
              <span className="text-[#e9c178]">Local Experts</span><br />
              for Every Need
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp} custom={2} className="text-base md:text-lg text-white/65 leading-relaxed max-w-xl">
              Find verified professionals for home, health, events, tutoring, and more.
              Book with confidence. <span className="text-[#e9c178] font-semibold">Live easy.</span>
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeUp} custom={3}>
              <SearchBar onSearch={handleSearch} />
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-4 pt-1">
              {[
                { icon: <Shield size={14} />, label: 'Verified Professionals' },
                { icon: <CheckCircle size={14} />, label: 'Secure & Easy Booking' },
                { icon: <Star size={14} />, label: '100% Satisfaction' },
              ].map((b) => (
                <span key={b.label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 border border-white/15 px-3 py-1.5 rounded-full">
                  {b.icon} {b.label}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── CATEGORIES STRIP ─────────────── */}
      <section className="bg-white border-b border-[rgba(198,198,206,0.3)] py-6 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-20 animate-pulse">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
                  <div className="w-16 h-3 bg-gray-100 rounded" />
                </div>
              ))
            ) : homeFeed.popularCategories?.length ? (
              homeFeed.popularCategories.slice(0, 10).map((cat, i) => (
                <button
                  key={cat._id || i}
                  onClick={() => navigate(`/search?category=${cat.slug}`)}
                  className="flex flex-col items-center gap-2 shrink-0 group"
                >
                  <div className="w-14 h-14 bg-[#f0f3ff] group-hover:bg-[#e7eeff] rounded-2xl flex items-center justify-center text-2xl transition-colors">
                    {cat.icon || '🏢'}
                  </div>
                  <span className="text-xs font-semibold text-[#45464d] group-hover:text-[#006a63] transition-colors text-center whitespace-nowrap max-w-[72px] truncate">
                    {cat.name}
                  </span>
                </button>
              ))
            ) : null}
            <button
              onClick={() => navigate('/search')}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="w-14 h-14 bg-[#f0f3ff] group-hover:bg-[#e7eeff] rounded-2xl flex items-center justify-center transition-colors">
                <span className="text-xl">⋯</span>
              </div>
              <span className="text-xs font-semibold text-[#45464d] group-hover:text-[#006a63] transition-colors">View All</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURED EXPERTS ─────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-[#f9f9ff]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Featured <span className="text-[#e9c178]">Experts</span> <span className="text-xl">✦</span>
              </h2>
              <p className="text-[#45464d] mt-2 text-sm">Top verified professionals, ready to help you today.</p>
            </div>
            <button onClick={() => navigate('/search')}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#131c2a] border border-[rgba(198,198,206,0.6)] px-4 py-2 rounded-xl hover:border-[#006a63]/40 hover:text-[#006a63] transition-colors">
              View All Experts <ArrowRight size={14} />
            </button>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="uh-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-8 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : homeFeed.featuredBusinesses?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {homeFeed.featuredBusinesses.slice(0, 8).map((biz, i) => (
                <motion.div key={biz._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <BusinessCard business={biz} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[rgba(198,198,206,0.5)] p-12 text-center text-sm text-[#76767e]">
              No featured experts yet. Check back soon!
            </div>
          )}

          <div className="text-center mt-10">
            <button onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#131c2a] text-white font-bold rounded-xl hover:bg-[#1e2940] transition-colors shadow-lg text-sm">
              Explore All Experts <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────── BECOME A PROVIDER BANNER ─────────────── */}
      <section className="py-6 px-6 lg:px-12 bg-[#f9f9ff]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-7 rounded-[20px] overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#0d1e35 0%,#0a2e2a 100%)' }}
          >
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-[#e9c178]/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                <Store size={26} className="text-[#e9c178]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Are you a service provider?
                </h3>
                <p className="text-sm text-white/60 mt-0.5">Join UstadHub and grow your local business.</p>
              </div>
            </div>
            <button onClick={() => navigate('/register')}
              className="relative z-10 shrink-0 flex items-center gap-2 px-6 py-3 bg-[#e9c178] text-[#131c2a] font-bold rounded-xl hover:bg-[#f0cf8a] transition-colors shadow-lg text-sm">
              Become a Provider <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── TOP RATED / RECENT ─────────────── */}
      {(homeFeed.topRatedBusinesses?.length > 0 || homeFeed.recentBusinesses?.length > 0) && (
        <section className="py-20 px-6 lg:px-12 bg-white">
          <div className="max-w-[1280px] mx-auto">

            {homeFeed.topRatedBusinesses?.length > 0 && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
                  <h2 className="text-3xl font-extrabold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Top Rated Businesses</h2>
                  <p className="text-[#45464d] mt-2 text-sm">Businesses with the strongest customer feedback</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
                  {homeFeed.topRatedBusinesses.map((biz, i) => (
                    <motion.div key={biz._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <BusinessCard business={biz} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {homeFeed.recentBusinesses?.length > 0 && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
                  <h2 className="text-3xl font-extrabold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Newly Joined</h2>
                  <p className="text-[#45464d] mt-2 text-sm">Fresh listings from real business owners</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {homeFeed.recentBusinesses.map((biz, i) => (
                    <motion.div key={biz._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <BusinessCard business={biz} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ─────────────── TRENDING SERVICES ─────────────── */}
      {homeFeed.trendingServices?.length > 0 && (
        <section className="py-20 px-6 lg:px-12 bg-[#f9f9ff]">
          <div className="max-w-[1280px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
              <h2 className="text-3xl font-extrabold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Trending Services</h2>
              <p className="text-[#45464d] mt-2 text-sm">Active services customers are viewing right now</p>
            </motion.div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {homeFeed.trendingServices.map((service) => (
                <div key={service._id}
                  className="uh-card rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/business/${service.business?.slug}`)}
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-[#006a63] mb-1">
                    {service.category?.name || 'Service'}
                  </div>
                  <h3 className="font-bold text-[#131c2a] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{service.name}</h3>
                  <p className="text-sm text-[#45464d] line-clamp-2 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between text-xs text-[#76767e]">
                    <span className="flex items-center gap-1"><Clock size={11} /> {service.duration} mins</span>
                    <span className="font-bold text-[#131c2a]">PKR {service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── LATEST REVIEWS ─────────────── */}
      {homeFeed.latestReviews?.length > 0 && (
        <section className="py-20 px-6 lg:px-12 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What Customers Say</h2>
              <p className="text-[#45464d] mt-2 text-sm">Real reviews from verified customers</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homeFeed.latestReviews.map((review, i) => (
                <motion.div key={review._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="uh-card rounded-2xl p-6"
                >
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(Math.max(1, review.rating || 5))].map((_, s) => (
                      <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#45464d] leading-relaxed mb-5 italic">"{review.review}"</p>
                  <div className="flex items-center gap-3">
                    <img src={review.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                      alt={review.user?.fullName || 'Customer'}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[rgba(0,106,99,0.2)]" />
                    <div>
                      <div className="text-sm font-bold text-[#131c2a]">{review.user?.fullName || 'Customer'}</div>
                      <div className="text-xs text-[#76767e]">{review.business?.name || 'Marketplace review'}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── FINAL CTA ─────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-[#f9f9ff]">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative rounded-[24px] overflow-hidden text-center px-8 py-16"
            style={{ background: 'linear-gradient(135deg,#071426 0%,#0a2e2a 100%)' }}
          >
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#e9c178]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#006a63]/15 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#e9c178]/15 border border-[#e9c178]/30">
                <Briefcase size={14} className="text-[#e9c178]" />
                <span className="text-xs font-bold text-[#e9c178]">For Service Providers</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ready to Grow Your Business?
              </h2>
              <p className="text-white/60 text-base mb-8 max-w-lg mx-auto">
                Join thousands of local businesses already getting more customers through UstadHub. Setup takes less than 5 minutes.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#e9c178] text-[#131c2a] font-bold rounded-xl hover:bg-[#f0cf8a] transition-colors shadow-xl text-sm"
              >
                List Your Business Free <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
