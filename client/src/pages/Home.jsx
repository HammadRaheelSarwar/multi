import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, MapPin, Star, Clock, Sparkles, Briefcase, User as UserIcon } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import CategoryCard from '../components/business/CategoryCard';
import BusinessCard from '../components/business/BusinessCard';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from '../hooks/useAuth';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
};

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

    // Real-time updates via Socket.io
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
      <section className="relative min-h-[790px] pt-28 pb-20 flex flex-col items-center justify-center text-left px-4 overflow-hidden z-0 home-section">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(0,106,99,0.35),transparent_32%),linear-gradient(135deg,#071426_0%,#101f36_55%,#071426_100%)] -z-10" />
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#006a63]/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#e9c178]/10 rounded-full blur-3xl -z-10" />
        <div className="hidden lg:block absolute right-[8%] top-28 w-[390px] h-[520px] rounded-[46%] border border-[#e9c178]/40 bg-[#006a63]/30 p-3 shadow-2xl shadow-black/30 rotate-3">
          <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=85" alt="Trusted Ustad Hub professional" className="h-full w-full rounded-[44%] object-cover opacity-90" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-3xl -z-10" />

        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-6xl w-full space-y-6 lg:pr-[390px]"
        >
          {/* Tag */}
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-white/10 border border-[#e9c178]/50 text-[#f0cf8a] shadow-lg backdrop-blur">
              <Sparkles size={14} /> Ustad Hub - Book Smart. Live Easy.
            </span>
          </motion.div>

          {/* Role Welcome Banner */}
          {isAuthenticated && user && (
            <motion.div
              variants={fadeUp}
              custom={0.5}
              className="mx-auto max-w-2xl bg-white/70 dark:bg-dark-800/70 border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-xl backdrop-blur-md flex items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
                  {user.role === 'business_owner' ? '💼' : '👤'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white font-outfit">
                    Welcome back!
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {user.role === 'business_owner' 
                      ? 'You are logged in as a Service Provider.' 
                      : 'You are logged in as a Customer.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(user.role === 'business_owner' ? '/business/profile' : '/search')}
                className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                {user.role === 'business_owner' ? 'Manage Your Business Studio' : 'Browse Local Services'}
                <ArrowRight size={12} />
              </button>
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1 variants={fadeUp} custom={1}
            className="text-4xl sm:text-5xl md:text-[5.25rem] font-extrabold text-white font-outfit leading-[0.98] tracking-[-0.055em] drop-shadow-sm"
          >
            Find Trusted<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              <span className="text-[#e9c178]">Local Experts</span>
            </span>{' '}
            Near You
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp} custom={2}
            className="text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed"
          >
            Discover skilled professionals, compare trusted businesses, and book the right service for your life — all in one beautiful place.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={fadeUp} custom={3} className="flex justify-start">
            <SearchBar onSearch={handleSearch} />
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="flex flex-wrap items-center justify-start gap-3 pt-2">
            <button onClick={() => navigate('/search')} className="premium-button inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">
              Explore services <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-6 py-3 text-sm font-bold text-gray-700 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 dark:border-white/15 dark:bg-white/10 dark:text-gray-200">
              List your business
            </button>
          </motion.div>

          <motion.div variants={fadeUp} custom={5} className="flex max-w-2xl flex-wrap items-center justify-start gap-x-8 gap-y-3 pt-5 text-xs font-semibold text-white/70">
            <span className="inline-flex items-center gap-2"><Star size={15} className="fill-amber-400 text-amber-400" /> Trusted by local customers</span>
            <span className="inline-flex items-center gap-2"><Briefcase size={15} className="text-blue-500" /> Real businesses</span>
            <span className="inline-flex items-center gap-2"><Clock size={15} className="text-emerald-500" /> Book in minutes</span>
          </motion.div>

          {/* Stats Row */}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-gray-400" />
          </div>
        </motion.div>
      </section>

      {/* ─────────────── CATEGORIES ─────────────── */}
      <section className="py-24 px-4 premium-section home-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">Browse by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Find any service you need from our curated categories</p>
          </motion.div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-dark-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading live marketplace data...</div>
          ) : homeFeed.popularCategories?.length ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {homeFeed.popularCategories.slice(0, 12).map((cat, i) => (
                <CategoryCard key={cat._id || i} category={cat} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-dark-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">No categories have been published yet.</div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
            >
              View all categories <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── FEATURED BUSINESSES ─────────────── */}
      <section className="py-24 px-4 premium-section home-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">Featured Businesses</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Top-rated, verified service providers our customers trust</p>
          </motion.div>

          {homeFeed.featuredBusinesses?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeFeed.featuredBusinesses.map((biz, i) => (
                <motion.div key={biz._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <BusinessCard business={biz} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-dark-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">No featured businesses are available yet.</div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              Explore All Businesses <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── RECENT BUSINESSES ─────────────── */}
      <section className="py-20 px-4 premium-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">Recently Joined Businesses</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Fresh listings created by real business owners</p>
          </motion.div>
          {homeFeed.recentBusinesses?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeFeed.recentBusinesses.map((biz, i) => (
                <motion.div key={biz._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <BusinessCard business={biz} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-dark-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">No businesses published yet.</div>
          )}
        </div>
      </section>

      {/* ─────────────── TOP RATED ─────────────── */}
      <section className="py-20 px-4 premium-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">Top Rated Businesses</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Businesses with the strongest customer feedback</p>
          </motion.div>
          {homeFeed.topRatedBusinesses?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeFeed.topRatedBusinesses.map((biz, i) => (
                <motion.div key={biz._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <BusinessCard business={biz} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-dark-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">No rated businesses available yet.</div>
          )}
        </div>
      </section>

      {/* ─────────────── TRENDING SERVICES ─────────────── */}
      <section className="py-20 px-4 premium-section">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">Trending Services</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Active services customers are viewing right now</p>
          </motion.div>
          {homeFeed.trendingServices?.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {homeFeed.trendingServices.map((service) => (
                <div key={service._id} className="rounded-2xl border border-gray-100 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">{service.category?.name || 'Service'}</div>
                      <h3 className="mt-1 font-bold text-gray-900 dark:text-white">{service.name}</h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{service.description}</p>
                    </div>
                    <span className="rounded-full bg-white dark:bg-dark-800 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">PKR {service.price}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1"><Clock size={12} /> {service.duration} mins</span>
                    <button onClick={() => navigate(`/business/${service.business?.slug}`)} className="font-semibold text-blue-600 dark:text-blue-400">View business</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-dark-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">No services published yet.</div>
          )}
        </div>
      </section>

      {/* ─────────────── LATEST REVIEWS ─────────────── */}
      <section className="py-20 px-4 premium-section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white font-outfit">Latest Reviews</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Customer feedback pulled directly from the marketplace</p>
          </motion.div>

          {homeFeed.latestReviews?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homeFeed.latestReviews.map((review, i) => (
                <motion.div key={review._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm">
                  <div className="flex items-center gap-1 mb-4 text-amber-500">{[...Array(Math.max(1, review.rating || 0))].map((_, s) => <span key={s}>★</span>)}</div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">"{review.review}"</p>
                  <div className="flex items-center gap-3">
                    <img src={review.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'} alt={review.user?.fullName || 'Customer'} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{review.user?.fullName || 'Customer'}</div>
                      <div className="text-xs text-gray-400">{review.business?.name || 'Marketplace review'}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-dark-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">No customer reviews yet.</div>
          )}
        </div>
      </section>

      {/* ─────────────── CTA BANNER ─────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-center overflow-hidden shadow-2xl shadow-blue-700/30"
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />

            <h2 className="text-4xl font-extrabold text-white font-outfit mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of local businesses already getting more customers through Ustad Hub. Setup takes less than 5 minutes.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-4 text-blue-700 bg-white font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
            >
              List Your Business Free <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
