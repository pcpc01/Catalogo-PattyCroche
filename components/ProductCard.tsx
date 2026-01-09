
import React, { useState } from 'react';
import { Product, PageName } from '../types';
import { Button } from './Button';
import { CEPModal } from './CEPModal';

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
  const [showCepModal, setShowCepModal] = useState(false);


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

  const getCleanDescription = (html: string) => {
    let text = convertHtmlToMarkdown(html);

    // Remove markdown syntax characters that might look messy in a plain text preview

    // Remove bold/italic markers (**text** or __text__)
    text = text.replace(/\*\*/g, '');
    text = text.replace(/__/g, '');

    // Remove header markers (# Title)
    text = text.replace(/^\s*#+\s+/gm, '');

    // Remove list bullets
    text = text.replace(/^\s*[-*+]\s+/gm, '');

    // Remove long separator lines
    text = text.replace(/[-=_*]{3,}/g, ' ');

    // Collapse whitespace
    text = text.replace(/\s+/g, ' ');

    return text.trim();
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div
        className="relative aspect-square overflow-hidden bg-white flex items-center justify-center rounded-t-xl cursor-pointer"
        onClick={() => onViewDetails && onViewDetails(product)}
        title="Ver detalhes"
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${product.additional_images && product.additional_images.length > 0
            ? 'group-hover:opacity-0 group-hover:scale-110'
            : 'group-hover:scale-105'
            }`}
        />
        {product.additional_images && product.additional_images.length > 0 && (
          <img
            src={product.additional_images[0]}
            alt={`${product.name} - vista alternativa`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-105 transition-all duration-700"
          />
        )}

        <div className="absolute inset-0 bg-patty-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
        <h3 className="text-xl font-semibold text-patty-graphite mb-2 group-hover:text-patty-teal transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {getCleanDescription(product.description)}
        </p>

        <div className="flex flex-col items-center gap-3 mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowCepModal(true)}
            className="text-lg font-bold text-patty-teal hover:text-patty-coral transition-all duration-300 transform hover:scale-105 cursor-pointer"
            title="Encomendar"
            disabled={isLoading}
          >
            R$ {product.price.toFixed(2).replace('.', ',')}
          </button>


          <Button
            variant="primary"
            size="sm"
            className="w-full px-6 gap-2 transition-all duration-300"
            onClick={() => setShowCepModal(true)}
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
                Encomenda
              </>

            )}
          </Button>
        </div>
      </div>
      <CEPModal
        isOpen={showCepModal}
        onClose={() => setShowCepModal(false)}
        product={product}
      />
    </div>
  );
};
