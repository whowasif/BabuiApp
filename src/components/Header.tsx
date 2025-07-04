import React from 'react';
import { Heart, User, Menu } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-white shadow-xl relative overflow-hidden">
      {/* Woven pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="headerWeave" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M0,7.5 Q3.75,3.75 7.5,7.5 T15,7.5" stroke="currentColor" strokeWidth="0.3" fill="none"/>
              <path d="M7.5,0 Q11.25,3.75 15,0" stroke="currentColor" strokeWidth="0.3" fill="none"/>
              <path d="M0,15 Q3.75,11.25 7.5,15" stroke="currentColor" strokeWidth="0.3" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#headerWeave)"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo with Babui Bird Icon */}
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Nest-like circular background */}
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center transform -rotate-12">
                  {/* Stylized Babui bird */}
                  <svg className="w-6 h-6 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c-1.5 0-3 .5-4 1.5C7 4.5 6.5 6 6.5 7.5c0 1 .3 2 .8 2.8L12 22l4.7-11.7c.5-.8.8-1.8.8-2.8 0-1.5-.5-3-1.5-4S13.5 2 12 2zm0 6c-.8 0-1.5-.7-1.5-1.5S11.2 5 12 5s1.5.7 1.5 1.5S12.8 8 12 8z"/>
                    <circle cx="12" cy="6.5" r="1" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              {/* Floating elements around the logo */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse delay-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                <span className="font-bengali text-amber-100">বাবুই</span>
              </h1>
              <p className="text-xs text-amber-200 font-medium tracking-wider">
                {t('app-tagline', 'নিখুঁত বাসা নির্মাতা', 'Master Nest Builder')}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="hover:text-amber-200 transition-colors duration-300 font-medium">
              {t('browse', 'ব্রাউজ করুন', 'Browse')}
            </a>
            <a href="#" className="hover:text-amber-200 transition-colors duration-300 font-medium">
              {t('list-property', 'সম্পত্তি তালিকাভুক্ত করুন', 'List Property')}
            </a>
            <a href="#" className="hover:text-amber-200 transition-colors duration-300 font-medium">
              {t('about', 'সম্পর্কে', 'About')}
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            
            {/* Favorites with nest-like design */}
            <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110 relative group">
              <Heart size={20} />
              <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
            </button>

            {/* Profile with nest-like design */}
            <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110 relative group">
              <User size={20} />
              <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
            </button>

            {/* Mobile Menu */}
            <button 
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;