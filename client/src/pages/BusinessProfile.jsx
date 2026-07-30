import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Globe, ShieldCheck, Star, Clock, X, Calendar, CheckCircle, ArrowLeft, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import StarRating from '../components/ui/StarRating';
import Spinner from '../components/common/Spinner';
import api from '../services/api';
import { getSocket } from '../services/socket';

const BusinessProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // Booking states
  const [bookingService, setBookingService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ];

  const handleBookService = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please log in to book a service'); navigate('/login'); return; }
    if (!bookingDate) { toast.error('Please select a booking date'); return; }
    if (!bookingSlot) { toast.error('Please select a time slot'); return; }

    setBookingLoading(true);
    try {
      const res = await api.post('/bookings', {
        service: bookingService._id,
        bookingDate,
        timeSlot: bookingSlot,
        notes: bookingNotes
      });
      if (res.data.success) {
        toast.success('Service booked successfully!');
        setBookingService(null);
        setBookingDate('');
        setBookingSlot('');
        setBookingNotes('');
      } else {
        toast.error(res.data.message || 'Failed to book service');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete booking');
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/businesses/profile/${slug}`);
        if (res.data.success) setBusiness(res.data.data);
        else setBusiness(null);
      } catch { setBusiness(null); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const loadReviews = async (businessId) => {
    setLoadingReviews(true);
    try {
      const res = await api.get(`/reviews/business/${businessId}`);
      if (res.data.success) setReviews(res.data.data || []);
      else setReviews([]);
    } catch { setReviews([]); }
    finally { setLoadingReviews(false); }
  };

  useEffect(() => { if (!business) return; loadReviews(business._id); }, [business?._id]);

  useEffect(() => {
    if (!business) return;
    const socket = getSocket();
    const handleReviewCreated = (payload) => {
      if (payload?.businessId === business._id) loadReviews(business._id);
    };
    socket.on('review:created', handleReviewCreated);
    return () => { socket.off('review:created', handleReviewCreated); };
  }, [business?._id]);

  if (loading) return (
    <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center pt-16">
      <Spinner size="large" />
    </div>
  );

  if (!business) return (
    <div className="min-h-screen bg-[#f9f9ff] flex flex-col items-center justify-center pt-16 gap-4">
      <div className="text-5xl">🔍</div>
      <h2 className="text-xl font-bold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Business not found</h2>
      <button onClick={() => navigate('/search')} className="flex items-center gap-2 text-sm text-[#006a63] font-semibold hover:underline">
        <ArrowLeft size={14} /> Back to Browse
      </button>
    </div>
  );

  const verificationBadge = { bronze: '🥉', silver: '🥈', gold: '🥇', premium: '💎' };

  // Find the minimum price among services
  const minPrice = business.servicesList?.length
    ? Math.min(...business.servicesList.map(s => s.price || 0))
    : null;

  // Gallery images (cover + gallery)
  const allImages = [
    ...(business.coverImages || []),
    ...(business.gallery || []),
  ].filter(Boolean);

  const TABS = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services & Pricing' },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'hours', label: 'Working Hours' },
  ];

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile link copied to clipboard!');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(!isFavorite ? 'Saved to your bookmarked experts!' : 'Removed from saved experts');
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiryText.trim()) { toast.error('Please enter your message'); return; }
    setInquiryLoading(true);
    setTimeout(() => {
      setInquiryLoading(false);
      setShowInquiryModal(false);
      setInquiryText('');
      toast.success('Message sent to provider! They usually respond within 2 hours.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff]">

      {/* ── Cinematic Hero ── */}
      <div className="relative w-full h-[380px] md:h-[480px] overflow-hidden">
        <img
          src={business.coverImages?.[0] || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=85'}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay — fades to page background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f9ff] via-[rgba(249,249,255,0.15)] to-transparent" />

        {/* Back & Action buttons */}
        <div className="absolute top-20 left-6 right-6 flex items-center justify-between z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-[#131c2a] shadow hover:bg-white transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProfile}
              className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-[#131c2a] shadow hover:bg-white transition-colors"
              title="Share profile"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 backdrop-blur-md rounded-xl shadow transition-colors ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-[#131c2a] hover:bg-white'
              }`}
              title={isFavorite ? 'Saved' : 'Save profile'}
            >
              <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 -mt-28 md:-mt-36 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Left Column ── */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 border-t-2 border-t-[#e9c178]"
            >
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                {/* Avatar */}
                <div className="shrink-0">
                  {business.logo ? (
                    <img src={business.logo} alt="Logo"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-lg" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-[#e7eeff] flex items-center justify-center text-4xl shadow-lg">
                      {business.category?.icon || '🏢'}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {/* Name + verified */}
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-extrabold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {business.name}
                    </h1>
                    {business.isVerified && (
                      <CheckCircle size={20} className="text-[#006a63] fill-[#e6f7f6]" title={`${business.verificationLevel} verified`} />
                    )}
                    {business.isFeatured && (
                      <span className="px-2 py-0.5 bg-[#fdf3e0] text-[#a07f3c] text-xs font-bold rounded-full border border-[rgba(233,193,120,0.4)]">
                        ⚡ Featured
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-[#45464d] text-base mb-3">{business.description?.split('.')[0] || 'Service Provider'}</p>

                  {/* Chips row */}
                  <div className="flex flex-wrap gap-2">
                    {business.category && (
                      <span className="uh-chip">{business.category.icon} {business.category.name}</span>
                    )}
                    {business.ratingAverage > 0 && (
                      <span className="uh-chip-neutral">
                        ★ {business.ratingAverage.toFixed(1)} ({business.reviewCount || 0} Reviews)
                      </span>
                    )}
                    {business.address?.city && (
                      <span className="uh-chip-neutral">
                        📍 {business.address.city}{business.address.state ? `, ${business.address.state}` : ''}
                      </span>
                    )}
                    {business.viewCount > 0 && (
                      <span className="uh-chip-neutral">👁 {business.viewCount.toLocaleString()} views</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="border-b border-[rgba(198,198,206,0.4)] bg-white rounded-t-xl px-2">
              <nav className="flex gap-1 overflow-x-auto no-scrollbar -mb-px">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-[#131c2a] text-[#131c2a]'
                        : 'border-transparent text-[#45464d] hover:text-[#131c2a]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

              {/* PORTFOLIO TAB */}
              {activeTab === 'portfolio' && (
                <div>
                  <h2 className="text-xl font-bold text-[#131c2a] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Selected Works</h2>
                  {allImages.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-[rgba(198,198,206,0.5)] p-12 text-center">
                      <div className="text-4xl mb-3">🖼️</div>
                      <p className="text-sm text-[#76767e]">No portfolio images yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Large first image */}
                      <div className="col-span-2 relative group rounded-2xl overflow-hidden h-[300px] shadow-md">
                        <img src={allImages[0]} alt="Portfolio 1"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                          <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{business.name}</h3>
                          <p className="text-white/70 text-sm">View Portfolio</p>
                        </div>
                      </div>
                      {/* Smaller images */}
                      {allImages.slice(1, 5).map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noreferrer"
                          className="relative group rounded-2xl overflow-hidden h-[200px] shadow-md block"
                        >
                          <img src={img} alt={`Portfolio ${idx + 2}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white font-semibold text-sm">View →</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SERVICES TAB */}
              {activeTab === 'services' && (
                <div>
                  <h2 className="text-xl font-bold text-[#131c2a] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Services & Pricing</h2>
                  {(business.servicesList || []).length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-[rgba(198,198,206,0.5)] p-12 text-center text-sm text-[#76767e]">
                      No services added yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {business.servicesList.map((svc) => (
                        <div key={svc._id} className="bg-white rounded-2xl border border-[rgba(198,198,206,0.4)] p-5 hover:border-[#006a63]/30 transition-colors">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="font-bold text-[#131c2a] mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{svc.name}</div>
                              <div className="text-xs text-[#76767e] flex items-center gap-1">
                                <Clock size={10} /> {svc.duration} mins
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-extrabold text-[#131c2a]">PKR {svc.price}</div>
                              <button
                                onClick={() => {
                                  if (!isAuthenticated) { toast.error('Please log in'); navigate('/login'); return; }
                                  setBookingService(svc);
                                }}
                                className="mt-1 px-3 py-1 text-xs font-bold text-white bg-[#006a63] hover:bg-[#00504a] rounded-lg transition-colors"
                              >
                                Book
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-[#45464d] leading-relaxed line-clamp-3">{svc.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="bg-white rounded-2xl p-6 border border-[rgba(198,198,206,0.4)]">
                  <h2 className="text-xl font-bold text-[#131c2a] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>About</h2>
                  <p className="text-[#45464d] leading-relaxed mb-6">{business.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {business.phone && (
                      <a href={`tel:${business.phone}`} className="flex items-center gap-3 p-4 rounded-xl bg-[#f0f3ff] hover:bg-[#e7eeff] transition-colors">
                        <div className="w-9 h-9 bg-[#e7eeff] rounded-xl flex items-center justify-center">
                          <Phone size={16} className="text-[#006a63]" />
                        </div>
                        <div>
                          <div className="text-xs text-[#76767e] font-medium">Phone</div>
                          <div className="text-sm font-bold text-[#131c2a]">{business.phone}</div>
                        </div>
                      </a>
                    )}
                    {business.whatsapp && (
                      <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl bg-[#f0f3ff] hover:bg-[#e7eeff] transition-colors">
                        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                          <MessageCircle size={16} className="text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-[#76767e] font-medium">WhatsApp</div>
                          <div className="text-sm font-bold text-[#131c2a]">{business.whatsapp}</div>
                        </div>
                      </a>
                    )}
                    {business.website && (
                      <a href={business.website} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl bg-[#f0f3ff] hover:bg-[#e7eeff] transition-colors">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Globe size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <div className="text-xs text-[#76767e] font-medium">Website</div>
                          <div className="text-sm font-bold text-[#131c2a] truncate max-w-[200px]">{business.website}</div>
                        </div>
                      </a>
                    )}
                    {business.address?.city && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f0f3ff]">
                        <div className="w-9 h-9 bg-[#e7eeff] rounded-xl flex items-center justify-center">
                          <MapPin size={16} className="text-[#006a63]" />
                        </div>
                        <div>
                          <div className="text-xs text-[#76767e] font-medium">Location</div>
                          <div className="text-sm font-bold text-[#131c2a]">
                            {business.address.street && `${business.address.street}, `}
                            {business.address.city}, {business.address.state}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-xl font-bold text-[#131c2a] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Customer Reviews</h2>
                  {loadingReviews ? (
                    <div className="text-center py-10"><Spinner /></div>
                  ) : reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-[rgba(198,198,206,0.5)] p-12 text-center text-sm text-[#76767e]">
                      No reviews yet. Be the first to review!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <div key={r._id} className="bg-white rounded-2xl p-5 border border-[rgba(198,198,206,0.4)]">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#006a63] font-bold text-sm shrink-0">
                              {r.user?.fullName?.[0] || '?'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-bold text-[#131c2a]">{r.user?.fullName || 'Customer'}</div>
                                <span className="text-xs text-[#76767e]">{new Date(r.createdAt).toLocaleDateString()}</span>
                              </div>
                              <StarRating rating={r.rating} size={12} />
                            </div>
                          </div>
                          <p className="text-sm text-[#45464d] leading-relaxed">{r.review}</p>
                          {r.ownerReply && (
                            <div className="mt-3 ml-8 p-3 rounded-xl bg-[#f0f3ff] border border-[rgba(0,106,99,0.15)]">
                              <p className="text-xs font-bold text-[#006a63] mb-1">Business Reply</p>
                              <p className="text-sm text-[#131c2a]">{r.ownerReply}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* HOURS TAB */}
              {activeTab === 'hours' && (
                <div className="bg-white rounded-2xl p-6 border border-[rgba(198,198,206,0.4)]">
                  <h2 className="text-xl font-bold text-[#131c2a] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Working Hours</h2>
                  <div className="space-y-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                      const hours = business.workingHours?.find(h => h.day === day);
                      const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;
                      return (
                        <div key={day} className={`flex items-center justify-between py-3 px-4 rounded-xl ${isToday ? 'bg-[#e6f7f6] border border-[rgba(0,106,99,0.2)]' : 'hover:bg-[#f0f3ff]'} transition-colors`}>
                          <div className="flex items-center gap-2">
                            <span className="capitalize text-sm font-semibold text-[#131c2a]">{day}</span>
                            {isToday && <span className="text-[10px] font-bold text-[#006a63] bg-[#006a63]/10 px-2 py-0.5 rounded-full">Today</span>}
                          </div>
                          {hours?.isClosed ? (
                            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">Closed</span>
                          ) : hours ? (
                            <span className="text-sm text-[#45464d] font-medium">{hours.open} – {hours.close}</span>
                          ) : (
                            <span className="text-sm text-[#76767e]">9:00 AM – 9:00 PM</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right Column — Booking Panel ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[rgba(198,198,206,0.4)] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(198,198,206,0.35)]">
                <h3 className="text-xl font-bold text-[#131c2a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Consultation</h3>
              </div>

              {/* Price */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-[#45464d]">Starting from</span>
                {minPrice !== null ? (
                  <span className="text-2xl font-extrabold text-[#e9c178]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    PKR {minPrice}<span className="text-sm font-normal text-[#76767e]">/session</span>
                  </span>
                ) : (
                  <span className="text-lg font-bold text-[#45464d]">Contact for pricing</span>
                )}
              </div>

              {/* Response time */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0f3ff] border border-[rgba(198,198,206,0.35)]">
                <Clock size={16} className="text-[#006a63] shrink-0" />
                <span className="text-sm font-medium text-[#131c2a]">Usually responds within 2 hours</span>
              </div>

              {/* Rating summary */}
              {business.ratingAverage > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0f3ff] border border-[rgba(198,198,206,0.35)]">
                  <Star size={16} className="text-amber-500 fill-amber-500 shrink-0" />
                  <span className="text-sm font-medium text-[#131c2a]">
                    {business.ratingAverage.toFixed(1)} rating · {business.reviewCount || 0} reviews
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <button
                onClick={() => {
                  if (!isAuthenticated) { toast.error('Please log in'); navigate('/login'); return; }
                  if (business.servicesList?.length) {
                    setBookingService(business.servicesList[0]);
                  } else {
                    toast('No services available for booking yet.');
                  }
                }}
                className="w-full py-3.5 bg-[#006a63] text-white font-bold rounded-xl hover:bg-[#00504a] transition-colors shadow-md text-sm"
              >
                Book Consultation
              </button>

              {(!isAuthenticated || (user && user._id !== business.owner?._id)) && (
                <button
                  onClick={() => {
                    if (!isAuthenticated) { toast.error('Please log in'); navigate('/login'); return; }
                    setShowInquiryModal(true);
                  }}
                  className="w-full py-3.5 bg-white border-2 border-[rgba(198,198,206,0.5)] text-[#131c2a] font-bold rounded-xl hover:border-[#131c2a] transition-colors text-sm"
                >
                  Send Message
                </button>
              )}

              {/* Contact links */}
              <div className="flex gap-3 pt-2">
                {business.phone && (
                  <a href={`tel:${business.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#006a63] border border-[rgba(0,106,99,0.3)] rounded-xl hover:bg-[#e6f7f6] transition-colors">
                    <Phone size={13} /> Call
                  </a>
                )}
                {business.whatsapp && (
                  <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                )}
              </div>

              {/* Verification badge */}
              {business.isVerified && (
                <div className="flex items-center gap-2 pt-2 text-xs text-[#45464d]">
                  <CheckCircle size={14} className="text-[#006a63]" />
                  <span>{verificationBadge[business.verificationLevel] || '✅'} {business.verificationLevel?.charAt(0).toUpperCase() + business.verificationLevel?.slice(1)} Verified Business</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      {bookingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBookingService(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-[24px] p-7 w-full max-w-md shadow-2xl"
          >
            <button onClick={() => setBookingService(null)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#f0f3ff] text-[#45464d]">
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-[#131c2a] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Book Service</h3>
            <p className="text-sm text-[#45464d] mb-6">{bookingService.name} — <span className="font-bold text-[#131c2a]">PKR {bookingService.price}</span></p>

            <form onSubmit={handleBookService} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider block mb-2">Select Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-3.5 text-[#76767e]" />
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#f0f3ff] border border-[rgba(198,198,206,0.4)] text-sm text-[#131c2a] outline-none focus:border-[#006a63] transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider block mb-2">Select Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} type="button" onClick={() => setBookingSlot(slot)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        bookingSlot === slot
                          ? 'bg-[#131c2a] text-white border-[#131c2a]'
                          : 'border-[rgba(198,198,206,0.5)] text-[#45464d] hover:border-[#131c2a]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider block mb-2">Notes (Optional)</label>
                <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)}
                  rows={3} placeholder="Any specific requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-[#f0f3ff] border border-[rgba(198,198,206,0.4)] text-sm text-[#131c2a] outline-none focus:border-[#006a63] resize-none transition-colors"
                />
              </div>

              <button type="submit" disabled={bookingLoading}
                className="w-full py-3.5 bg-[#006a63] text-white font-bold rounded-xl hover:bg-[#00504a] disabled:opacity-50 transition-colors text-sm">
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Quick Inquiry Modal ── */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInquiryModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-[24px] p-7 w-full max-w-md shadow-2xl"
          >
            <button onClick={() => setShowInquiryModal(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#f0f3ff] text-[#45464d]">
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-[#131c2a] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Send Inquiry to {business.name}
            </h3>
            <p className="text-xs text-[#76767e] mb-6">Ask about custom quotes, availability, or project scope.</p>

            <form onSubmit={handleSendInquiry} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider block mb-2">Your Message</label>
                <textarea
                  value={inquiryText}
                  onChange={e => setInquiryText(e.target.value)}
                  rows={4}
                  placeholder="Hi, I would like to inquire about..."
                  className="w-full px-4 py-3 rounded-xl bg-[#f0f3ff] border border-[rgba(198,198,206,0.4)] text-sm text-[#131c2a] outline-none focus:border-[#006a63] resize-none transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowInquiryModal(false)}
                  className="flex-1 py-3 text-sm font-semibold text-[#45464d] border border-[rgba(198,198,206,0.5)] rounded-xl hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={inquiryLoading}
                  className="flex-1 py-3 bg-[#131c2a] text-white font-bold rounded-xl hover:bg-[#1e2940] disabled:opacity-50 transition-colors text-sm shadow-md">
                  {inquiryLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BusinessProfile;

