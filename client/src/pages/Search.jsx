import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BusinessCard from '../components/business/BusinessCard';
import Spinner from '../components/common/Spinner';
import api from '../services/api';

const Search = ({ initialTab = 'all' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const [filters, setFilters] = useState({
    verifiedOnly: searchParams.get('verifiedOnly') === 'true',
    featuredOnly: searchParams.get('featuredOnly') === 'true',
    minRating: searchParams.get('minRating') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    maxPrice: 500,
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [cityQuery, setCityQuery] = useState(searchParams.get('city') || '');

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', page);
      params.set('limit', 9);
      if (filters.verifiedOnly) params.set('verifiedOnly', 'true');
      if (filters.featuredOnly) params.set('featuredOnly', 'true');
      if (filters.minRating) params.set('minRating', filters.minRating);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);

      const res = await api.get(`/search/businesses?${params.toString()}`);
      if (res.data.success && res.data.data?.businesses?.length) {
        setBusinesses(res.data.data.businesses);
        setTotal(res.data.data.total);
      } else {
        setBusinesses([]);
        setTotal(0);
      }
    } catch {
      setBusinesses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBusinesses(); }, [searchParams, page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set('query', searchQuery); else params.delete('query');
    if (cityQuery) params.set('city', cityQuery); else params.delete('city');
    params.delete('page');
    setSearchParams(params);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 9);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#76767e] mb-3">Category</div>
        <div className="space-y-2.5">
          {['Legal Consulting', 'Financial Advisory', 'Business Strategy', 'Home Services', 'Tutoring'].map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 rounded border-2 border-[rgba(198,198,206,0.7)] flex items-center justify-center group-hover:border-[#006a63] transition-colors">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#006a63] opacity-0 group-hover:opacity-30 transition-opacity" />
              </div>
              <span className="text-sm text-[#45464d] group-hover:text-[#131c2a] transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-[rgba(198,198,206,0.4)]" />

      {/* Hourly Rate slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#76767e]">Price Range</div>
          <span className="text-xs font-semibold text-[#006a63]">PKR {filters.maxPrice}+</span>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          value={filters.maxPrice}
          onChange={(e) => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#76767e] mt-1">
          <span>PKR 0</span>
          <span>PKR 1000+</span>
        </div>
      </div>

      <div className="border-t border-[rgba(198,198,206,0.4)]" />

      {/* Min Rating */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#76767e] mb-3">Min Rating</div>
        <select
          value={filters.minRating}
          onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
          className="w-full px-3 py-2.5 text-sm rounded-xl bg-[#f0f3ff] border border-[rgba(198,198,206,0.4)] text-[#131c2a] outline-none focus:border-[#006a63] transition-colors"
        >
          <option value="">Any rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      <div className="border-t border-[rgba(198,198,206,0.4)]" />

      {/* Attributes */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#76767e] mb-3">Attributes</div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'featuredOnly', label: '✦ Featured' },
            { key: 'verifiedOnly', label: '✓ Verified' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilters(f => ({ ...f, [key]: !f[key] }))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                filters[key]
                  ? 'bg-[#131c2a] text-white border-[#131c2a]'
                  : 'bg-white text-[#45464d] border-[rgba(198,198,206,0.6)] hover:border-[#131c2a]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[rgba(198,198,206,0.4)]" />

      {/* Sort By */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#76767e] mb-3">Sort By</div>
        <select
          value={filters.sortBy}
          onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
          className="w-full px-3 py-2.5 text-sm rounded-xl bg-[#f0f3ff] border border-[rgba(198,198,206,0.4)] text-[#131c2a] outline-none focus:border-[#006a63] transition-colors"
        >
          <option value="newest">Newest</option>
          <option value="highest_rated">Highest Rated</option>
          <option value="nearest">Nearest</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f9ff] pt-16">

      {/* ─── Search Header ─── */}
      <div className="bg-white border-b border-[rgba(198,198,206,0.35)] py-5 px-6 lg:px-12 sticky top-16 z-30 shadow-sm">
        <div className="max-w-[1280px] mx-auto">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#f0f3ff] border border-[rgba(198,198,206,0.4)] rounded-xl px-4 py-2.5 focus-within:border-[#006a63] transition-colors">
              <SearchIcon size={16} className="text-[#76767e] shrink-0" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm text-[#131c2a] placeholder-[#76767e] bg-transparent outline-none"
              />
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-[#f0f3ff] border border-[rgba(198,198,206,0.4)] rounded-xl px-4 py-2.5 focus-within:border-[#006a63] transition-colors w-48">
              <input
                type="text"
                placeholder="City or area..."
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                className="flex-1 text-sm text-[#131c2a] placeholder-[#76767e] bg-transparent outline-none"
              />
            </div>
            <button type="submit"
              className="px-6 py-2.5 bg-[#006a63] text-white text-sm font-bold rounded-xl hover:bg-[#00504a] transition-colors shadow-sm">
              Search
            </button>
            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden p-2.5 bg-white border border-[rgba(198,198,206,0.5)] rounded-xl text-[#45464d]"
            >
              <SlidersHorizontal size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
        <div className="flex gap-8">

          {/* ─── Filters Sidebar (Desktop) ─── */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="uh-card rounded-2xl p-6 sticky top-36">
              <h3 className="text-base font-bold text-[#131c2a] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Filters
              </h3>
              <FilterPanel />
            </div>
          </aside>

          {/* ─── Mobile Filter Drawer ─── */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 md:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-6 overflow-y-auto md:hidden shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Filters</h3>
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 rounded-lg hover:bg-[#f0f3ff] text-[#45464d]">
                      <X size={18} />
                    </button>
                  </div>
                  <FilterPanel />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ─── Results ─── */}
          <div className="flex-1 min-w-0">
            {/* View Filter Tabs (All / Experts / Services) */}
            <div className="flex items-center gap-2 mb-6 border-b border-[rgba(198,198,206,0.35)] pb-3">
              {[
                { id: 'all', label: 'All Marketplace' },
                { id: 'experts', label: 'Experts & Businesses' },
                { id: 'services', label: 'Direct Services' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === t.id
                      ? 'bg-[#131c2a] text-white shadow-sm'
                      : 'bg-white text-[#45464d] border border-[rgba(198,198,206,0.5)] hover:border-[#131c2a]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Header row */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {activeTab === 'services' ? 'Explore Services' : activeTab === 'experts' ? 'Top Verified Experts' : 'Browse Marketplace'}
                </h1>
                <p className="mt-1.5 text-sm text-[#45464d]">
                  {activeTab === 'services' ? 'Find and book instant services from certified local providers.' : 'Discover elite professionals tailored to your needs.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#76767e] font-medium hidden sm:block">
                  {loading ? 'Searching...' : `${total} found`}
                </span>
                {/* View toggle */}
                <div className="flex border border-[rgba(198,198,206,0.5)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#131c2a] text-white' : 'text-[#45464d] hover:bg-[#f0f3ff]'}`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#131c2a] text-white' : 'text-[#45464d] hover:bg-[#f0f3ff]'}`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="uh-card rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-8 bg-gray-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-5">🔍</div>
                <h3 className="text-xl font-bold text-[#131c2a] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  No businesses found
                </h3>
                <p className="text-[#76767e] text-sm">Try adjusting your search or filters, or check back after owners publish new listings.</p>
              </div>
            ) : (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {businesses.map((biz, i) => (
                  <motion.div key={biz._id || i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    {viewMode === 'grid' ? (
                      <BusinessCard business={biz} />
                    ) : (
                      /* List view card */
                      <div
                        onClick={() => navigate(`/business/${biz.slug}`)}
                        className="uh-card rounded-2xl flex gap-4 p-4 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={biz.coverImages?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=300&q=80'}
                            alt={biz.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-[#131c2a] truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{biz.name}</h3>
                          </div>
                          {biz.category && <div className="text-xs font-semibold text-[#006a63] mb-1">{biz.category.icon} {biz.category.name}</div>}
                          {biz.description && <p className="text-xs text-[#45464d] line-clamp-2 mb-2">{biz.description}</p>}
                          <div className="flex items-center gap-3 text-xs text-[#76767e]">
                            <span>⭐ {biz.ratingAverage?.toFixed(1) || '0.0'}</span>
                            {biz.address?.city && <span>📍 {biz.address.city}</span>}
                          </div>
                        </div>
                        <div className="flex items-center shrink-0">
                          <span className="text-xs font-semibold text-[#006a63]">View Profile →</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm border border-[rgba(198,198,206,0.5)] text-[#45464d] hover:bg-[#f0f3ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                      page === i + 1
                        ? 'bg-[#131c2a] text-white shadow-md'
                        : 'border border-[rgba(198,198,206,0.5)] text-[#45464d] hover:bg-[#f0f3ff]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm border border-[rgba(198,198,206,0.5)] text-[#45464d] hover:bg-[#f0f3ff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
