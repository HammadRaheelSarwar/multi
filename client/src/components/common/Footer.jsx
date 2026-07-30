import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#131c2a] text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <img src="/logo.png" alt="UstadHub" className="h-14 w-auto object-contain object-left" />
            <p className="text-sm text-[#76767e] leading-relaxed max-w-xs">
              Book smart. Live easy. UstadHub connects you with trusted local experts for every need.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(118,118,126,0.4)] text-[#76767e] hover:border-[#e9c178] hover:text-[#e9c178] transition-colors">
                <Facebook size={15} />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(118,118,126,0.4)] text-[#76767e] hover:border-[#e9c178] hover:text-[#e9c178] transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(118,118,126,0.4)] text-[#76767e] hover:border-[#e9c178] hover:text-[#e9c178] transition-colors">
                <Twitter size={15} />
              </a>
              <a href="#" aria-label="Youtube" className="w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(118,118,126,0.4)] text-[#76767e] hover:border-[#e9c178] hover:text-[#e9c178] transition-colors">
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#76767e] mb-5">For Customers</h4>
            <ul className="space-y-3">
              <li><Link to="/search" className="text-sm text-[#c6c6ce] hover:text-[#e9c178] transition-colors">Explore Services</Link></li>
              <li><Link to="/search" className="text-sm text-[#c6c6ce] hover:text-[#e9c178] transition-colors">How It Works</Link></li>
              <li><Link to="/search" className="text-sm text-[#c6c6ce] hover:text-[#e9c178] transition-colors">Safety & Trust</Link></li>
              <li><Link to="/search" className="text-sm text-[#c6c6ce] hover:text-[#e9c178] transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#76767e] mb-5">For Providers</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-sm text-[#c6c6ce] hover:text-[#e9c178] transition-colors">Become a Provider</Link></li>
              <li><Link to="/register" className="text-sm text-[#c6c6ce] hover:text-[#e9c178] transition-colors">Provider Resources</Link></li>
              <li><Link to="/register" className="text-sm text-[#c6c6ce] hover:text-[#e9c178] transition-colors">Success Stories</Link></li>
              <li><Link to="/register" className="text-sm text-[#c6c6ce] hover:text-[#e9c178] transition-colors">Partner Program</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#76767e] mb-5">Newsletter</h4>
            <p className="text-sm text-[#76767e] mb-4">Get the latest news and offers delivered to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-lg bg-[#1e2940] border border-[rgba(118,118,126,0.3)] text-white placeholder-[#76767e] focus:outline-none focus:border-[#006a63] transition-colors"
              />
              <button className="p-2.5 bg-[#006a63] hover:bg-[#00504a] rounded-lg text-white transition-colors shrink-0">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(118,118,126,0.2)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#76767e]">
            © {new Date().getFullYear()} UstadHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-[#76767e] hover:text-[#e9c178] transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="text-xs text-[#76767e] hover:text-[#e9c178] transition-colors">Terms of Service</Link>
            <Link to="/search"  className="text-xs text-[#76767e] hover:text-[#e9c178] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
