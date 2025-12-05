
import React, { useState } from 'react';
import { PageName } from '../types';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks: { name: string; id: PageName }[] = [
    { name: 'Home', id: 'home' },
    { name: 'Catálogo', id: 'catalog' },
    { name: 'Sobre Mim', id: 'about' },
    { name: 'Contato', id: 'contact' },
  ];

  const handleNavClick = (page: PageName) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="cursor-pointer flex items-center justify-center group"
          >
            <img 
              src="https://res.cloudinary.com/duljbwers/image/upload/v1764761186/ai_studio_1764685738763_1_zy6guk.png" 
              alt="PattyCrochê" 
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 relative py-2
                  ${currentPage === link.id ? 'text-patty-teal' : 'text-gray-500 hover:text-patty-coral'}
                `}
              >
                {link.name}
                {currentPage === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-patty-teal animate-fade-in"></span>
                )}
              </button>
            ))}
          </div>

          {/* CTA & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button 
                size="sm" 
                className="hidden md:inline-flex" 
                variant={currentPage === 'cart' ? 'secondary' : 'primary'}
                onClick={() => handleNavClick('cart')}
              >
                <ShoppingBag size={18} className="mr-2" />
                Carrinho
              </Button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-patty-coral text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce-slow">
                  {cartCount}
                </span>
              )}
            </div>
            
            <button 
              className="md:hidden p-2 text-patty-graphite hover:bg-gray-100 rounded-md transition-colors relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              {!isMenuOpen && cartCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-patty-coral rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-slide-down shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors
                  ${currentPage === link.id 
                    ? 'bg-patty-teal/10 text-patty-teal' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 px-4 border-t border-gray-100">
              <Button 
                className="w-full justify-center relative" 
                onClick={() => handleNavClick('cart')}
              >
                <ShoppingBag size={18} className="mr-2" />
                Ver Carrinho ({cartCount})
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
