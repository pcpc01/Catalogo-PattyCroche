
import React, { useState } from 'react';
import { Product, PageName } from '../types';
import { Button } from './Button';
import { Eye, ShoppingBag, Check, Share2, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { convertHtmlToMarkdown } from '../utils';

interface ProductCardProps {
  product: Product;
  onNavigate?: (page: PageName) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, onViewDetails }) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleAddToCart = () => {
    setIsLoading(true);
    addToCart(product);

    // Show loading state briefly then navigate
    setTimeout(() => {
      setIsLoading(false);
      if (onNavigate) {
        onNavigate('cart');
      }
    }, 600);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();

    const shareData = {
      title: product.name,
      text: `Confira ${product.name} na PattyCrochê!`,
      url: window.location.href // Em um app real, seria a URL específica do produto
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => { });
    } else {
      navigator.clipboard.writeText(shareData.url);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-patty-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Actions overlay */}
        <div className="absolute bottom-3 right-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 flex gap-1 items-center">
          <button
            onClick={handleShare}
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 ${isShared
              ? 'bg-green-500 text-white'
              : 'bg-white text-patty-teal hover:bg-patty-teal hover:text-white'
              }`}
            title="Compartilhar"
          >
            {isShared ? <Check size={12} /> : <Share2 size={12} />}
          </button>

          <button
            onClick={() => onViewDetails && onViewDetails(product)}
            className="px-2 py-0.5 bg-white rounded-full text-patty-coral text-[10px] font-bold hover:bg-patty-coral hover:text-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-px"
          >
            <Eye size={12} />
            Detalhes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-medium text-patty-coral uppercase tracking-wider mb-2">
          {product.category}
        </span>
        <h3 className="font-serif text-xl font-semibold text-patty-graphite mb-2 group-hover:text-patty-teal transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {convertHtmlToMarkdown(product.description)}
        </p>

        <div className="flex flex-col items-center gap-3 mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            className="text-lg font-bold text-patty-teal hover:text-patty-coral transition-all duration-300 transform hover:scale-105 cursor-pointer"
            title="Adicionar ao Carrinho"
            disabled={isLoading}
          >
            R$ {product.price.toFixed(2).replace('.', ',')}
          </button>

          <Button
            variant="primary"
            size="sm"
            className="w-full px-6 gap-2 transition-all duration-300"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                Comprar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
