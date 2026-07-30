import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Crown, Star, ArrowRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Memberships = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [annualBilling, setAnnualBilling] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const PLANS = [
    {
      id: 'customer_free',
      name: 'Starter Member',
      target: 'For Customers',
      tagline: 'Essential access for everyday home & service needs.',
      priceMonthly: 0,
      priceAnnual: 0,
      currency: 'PKR',
      badge: null,
      color: 'border-[rgba(198,198,206,0.5)] bg-white',
      btnStyle: 'bg-white border-2 border-[#131c2a] text-[#131c2a] hover:bg-[#131c2a] hover:text-white',
      features: [
        'Browse verified local experts',
        'Book standard consultation slots',
        'Direct call & WhatsApp contact',
        'Standard customer support',
        'Leave rating & reviews',
      ],
    },
    {
      id: 'customer_vip',
      name: 'VIP Member',
      target: 'For Priority Clients',
      tagline: 'Exclusive perks, instant concierge booking, & 0% fee.',
      priceMonthly: 1999,
      priceAnnual: 1599,
      currency: 'PKR',
      badge: 'Most Popular',
      color: 'border-2 border-[#e9c178] bg-white shadow-xl shadow-[#e9c178]/10',
      btnStyle: 'bg-[#e9c178] text-[#131c2a] hover:bg-[#f0cf8a]',
      features: [
        'All Starter features included',
        'Priority instant booking slots',
        'Zero service convenience fees',
        'VIP customer support hotline',
        '10% cash discount on all services',
        'Exclusive monthly partner offers',
      ],
    },
    {
      id: 'provider_pro',
      name: 'Pro Expert',
      target: 'For Service Providers',
      tagline: 'Supercharge your business with premium search ranking & badge.',
      priceMonthly: 4999,
      priceAnnual: 3999,
      currency: 'PKR',
      badge: 'Provider Special',
      color: 'border-2 border-[#006a63] bg-white shadow-xl shadow-[#006a63]/10',
      btnStyle: 'bg-[#006a63] text-white hover:bg-[#00504a]',
      features: [
        'Gold Verified Business Badge',
        'Top 3 Search & Home placement',
        'Unlimited service & gallery listings',
        '0% commission on direct bookings',
        'Advanced booking analytics & lead tracking',
        'Custom business profile URL',
      ],
    },
    {
      id: 'provider_agency',
      name: 'Enterprise Hub',
      target: 'For Teams & Agencies',
      tagline: 'Complete suite for multi-staff companies & franchises.',
      priceMonthly: 14999,
      priceAnnual: 11999,
      currency: 'PKR',
      badge: 'Ultimate Power',
      color: 'border border-[rgba(198,198,206,0.5)] bg-[#131c2a] text-white',
      btnStyle: 'bg-white text-[#131c2a] hover:bg-gray-100',
      features: [
        'Everything in Pro Expert plan',
        'Multi-staff sub-account management',
        'Dedicated 24/7 Account Manager',
        'API & custom CRM integrations',
        'Custom contract & invoicing tools',
        'Featured home banner spotlight',
      ],
    },
  ];

  const FAQS = [
    {
      q: 'Can I cancel or switch my membership plan anytime?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your membership at any time from your account settings with zero hidden fees.',
    },
    {
      q: 'What is the Gold Verified Badge for service providers?',
      a: 'The Gold Verified Badge is awarded to providers who undergo document verification on UstadHub. It increases booking conversions by up to 300%.',
    },
    {
      q: 'How does annual billing discount work?',
      a: 'Choosing annual billing saves you 20% compared to monthly payments. The total amount for 12 months is billed upfront once a year.',
    },
    {
      q: 'What payment methods do you support in Pakistan?',
      a: 'We support all major payment options including JazzCash, EasyPaisa, VISA, Mastercard, and Direct Bank Transfers.',
    },
  ];

  const handleSelectPlan = (plan) => {
    if (plan.priceMonthly === 0) {
      toast.success('You are currently on the Starter Member free plan!');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please log in to upgrade your membership');
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
  };

  const handleConfirmCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      toast.success(`Successfully subscribed to ${selectedPlan.name}! Welcome to UstadHub Premium.`);
      setSelectedPlan(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] pt-24 pb-20">

      {/* ─── Hero Header ─── */}
      <section className="text-center max-w-4xl mx-auto px-6 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#e9c178]/20 border border-[#e9c178]/40 text-[#a07f3c] mb-4">
            <Crown size={14} className="text-[#a07f3c]" /> UstadHub Premium Memberships
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#131c2a] leading-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Elevate Your Experience with <span className="text-[#006a63]">Premium Access</span>
          </h1>
          <p className="text-lg text-[#45464d] max-w-2xl mx-auto leading-relaxed">
            Whether you are seeking top-tier service or growing an elite business, choose the plan that unlocks your full potential.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-bold ${!annualBilling ? 'text-[#131c2a]' : 'text-[#76767e]'}`}>Monthly Billing</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative w-14 h-8 rounded-full bg-[#131c2a] p-1 transition-colors"
            >
              <div className={`w-6 h-6 rounded-full bg-[#e9c178] transition-transform ${annualBilling ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold flex items-center gap-1.5 ${annualBilling ? 'text-[#131c2a]' : 'text-[#76767e]'}`}>
              Annual Billing
              <span className="text-[10px] font-extrabold bg-[#e6f7f6] text-[#006a63] px-2 py-0.5 rounded-full border border-[rgba(0,106,99,0.2)]">
                SAVE 20%
              </span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* ─── Pricing Grid ─── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan, i) => {
            const price = annualBilling ? plan.priceAnnual : plan.priceMonthly;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`uh-card rounded-[24px] p-6 flex flex-col justify-between relative ${plan.color}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#e9c178] text-[#131c2a] text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#76767e] mb-1">{plan.target}</div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{plan.name}</h3>
                  <p className="text-xs opacity-75 mb-6 min-h-[32px] leading-relaxed">{plan.tagline}</p>

                  {/* Price display */}
                  <div className="mb-6 pb-6 border-b border-current/10">
                    {price === 0 ? (
                      <span className="text-3xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Free</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-semibold opacity-70">PKR</span>
                        <span className="text-3xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{price.toLocaleString()}</span>
                        <span className="text-xs opacity-70">/mo</span>
                      </div>
                    )}
                    {annualBilling && price > 0 && (
                      <div className="text-[10px] opacity-60 mt-1">Billed annually (PKR {(price * 12).toLocaleString()}/yr)</div>
                    )}
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs leading-snug opacity-90">
                        <Check size={14} className="shrink-0 text-[#006a63] mt-0.5" style={{ color: plan.id === 'provider_agency' ? '#e9c178' : undefined }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${plan.btnStyle}`}
                >
                  {price === 0 ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Feature Comparison Matrix ─── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-24">
        <div className="bg-white rounded-[24px] p-8 border border-[rgba(198,198,206,0.4)] shadow-md">
          <h2 className="text-2xl font-bold text-[#131c2a] mb-6 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Compare Membership Features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(198,198,206,0.4)]">
                  <th className="py-4 px-4 text-[#45464d] font-bold">Feature</th>
                  <th className="py-4 px-4 text-center font-bold">Starter</th>
                  <th className="py-4 px-4 text-center font-bold text-[#a07f3c]">VIP Client</th>
                  <th className="py-4 px-4 text-center font-bold text-[#006a63]">Pro Expert</th>
                  <th className="py-4 px-4 text-center font-bold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(198,198,206,0.3)]">
                {[
                  { name: 'Expert Profile Search', starter: 'Standard', vip: 'Priority', pro: 'Top Search', ent: 'Home Spotlight' },
                  { name: 'Booking Commission Fee', starter: 'Standard', vip: '0%', pro: '0%', ent: '0%' },
                  { name: 'Verified Badge', starter: '—', vip: 'VIP Badge', pro: 'Gold Badge', ent: 'Agency Badge' },
                  { name: 'Support SLA', starter: '24-48 hrs', vip: 'Instant VIP', pro: 'Priority', ent: 'Dedicated 24/7 Manager' },
                  { name: 'Service Listings', starter: '1 listing', vip: 'Unlimited', pro: 'Unlimited', ent: 'Unlimited' },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-[#f0f3ff]/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#131c2a]">{row.name}</td>
                    <td className="py-4 px-4 text-center text-[#76767e]">{row.starter}</td>
                    <td className="py-4 px-4 text-center font-semibold text-[#a07f3c]">{row.vip}</td>
                    <td className="py-4 px-4 text-center font-semibold text-[#006a63]">{row.pro}</td>
                    <td className="py-4 px-4 text-center font-bold text-[#131c2a]">{row.ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-[#131c2a] mb-6 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[rgba(198,198,206,0.4)] overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-[#131c2a] hover:bg-[#f0f3ff] transition-colors text-sm"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-[#45464d] leading-relaxed border-t border-[rgba(198,198,206,0.3)] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Checkout Modal ─── */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPlan(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-[24px] p-7 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-xl font-bold text-[#131c2a] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Subscribe to {selectedPlan.name}
            </h3>
            <p className="text-sm text-[#45464d] mb-6">
              Total: <span className="font-extrabold text-[#131c2a]">PKR {(annualBilling ? selectedPlan.priceAnnual : selectedPlan.priceMonthly).toLocaleString()}</span> / month
              {annualBilling && <span className="text-xs text-[#006a63] block font-semibold">(Billed annually)</span>}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {['JazzCash / EasyPaisa', 'Credit / Debit Card'].map((pm, idx) => (
                    <button key={pm} type="button"
                      className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        idx === 0 ? 'bg-[#131c2a] text-white border-[#131c2a]' : 'border-[rgba(198,198,206,0.5)] text-[#45464d] hover:border-[#131c2a]'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider block mb-2">Account Phone / Email</label>
                <input type="text" placeholder="0300 1234567" defaultValue="0300 9876543"
                  className="w-full px-4 py-3 rounded-xl bg-[#f0f3ff] border border-[rgba(198,198,206,0.4)] text-sm text-[#131c2a] outline-none" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedPlan(null)}
                className="flex-1 py-3 text-sm font-semibold text-[#45464d] border border-[rgba(198,198,206,0.5)] rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleConfirmCheckout} disabled={checkoutLoading}
                className="flex-1 py-3 bg-[#006a63] text-white font-bold rounded-xl hover:bg-[#00504a] text-sm shadow-md disabled:opacity-50">
                {checkoutLoading ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Memberships;
