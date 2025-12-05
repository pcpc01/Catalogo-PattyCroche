
import React, { useState, useEffect } from 'react';
import { Product, PageName } from '../types';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/productService';
import {
  ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Heart,
  Share2, Check, Minus, Plus, Loader2, X, Copy, Facebook,
  Twitter, Linkedin, Link as LinkIcon, MessageCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { convertHtmlToMarkdown } from '../utils';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsProps {
  product: Product;
  onNavigate: (page: PageName) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onNavigate, onViewDetails }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    // Document title
    const originalTitle = document.title;
    document.title = `${product.name} | PattyCrochê`;

    // Reset state when product changes
    setQuantity(1);
    setIsAdded(false);
    setIsBuying(false);
    setShowShareModal(false);
    setLinkCopied(false);

    // Find related products (same category, excluding current)
    const loadRelated = async () => {
      try {
        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => p.category === product.category && p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to load related products", error);
      }
    };
    loadRelated();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = originalTitle;
    };
  }, [product]);

  const handleAddToCart = () => {
    // Add product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    setIsBuying(true);
    // Add product to cart before navigating
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setTimeout(() => {
      onNavigate('cart');
      setIsBuying(false);
    }, 800);
  };

  const handleCopyLink = () => {
    // In a real app, use the actual URL. Here we mock or use window.location
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const shareUrl = window.location.href;
  const shareText = `Confira ${product.name} na PattyCrochê!`;

  return (
    <div className="animate-fade-in pb-20 relative">
      {/* Breadcrumb */}
      <div className="bg-patty-cream border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center text-sm text-gray-500 hover:text-patty-teal transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o Catálogo
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

          {/* Product Image */}
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm aspect-square relative group">
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-patty-coral text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md z-10">
                  Novo
                </span>
              )}
              {product.isOnSale && (
                <span className="absolute top-4 left-4 bg-patty-mustard text-patty-graphite text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md z-10 ml-16">
                  Promoção
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Thumbnails (Mock) */}
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((idx) => (
                <button key={idx} className={`rounded-lg overflow-hidden border-2 aspect-square ${idx === 0 ? 'border-patty-teal' : 'border-transparent hover:border-gray-300'}`}>
                  <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-bold text-patty-coral uppercase tracking-wider">{product.category}</span>
              <div className="flex text-patty-mustard">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="text-gray-400 text-xs ml-1">(12 avaliações)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-patty-graphite mb-4">{product.name}</h1>

            <p className="text-3xl font-bold text-patty-teal mb-6">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>

            <div className="text-gray-600 mb-8 leading-relaxed prose prose-patty-teal max-w-none">
              <ReactMarkdown>
                {convertHtmlToMarkdown(product.description) + "\n\nEste produto é confeccionado à mão com fios de alta qualidade, garantindo durabilidade e um toque macio incomparável. Perfeito para presentear ou decorar seu ambiente com elegância e exclusividade."}
              </ReactMarkdown>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center border border-gray-200 rounded-full w-max">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-patty-teal transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium text-patty-graphite">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-patty-teal transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex gap-3 flex-grow">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className={`flex-1 transition-all duration-300 ${isAdded
                    ? '!bg-green-500 !border-green-500 !text-white transform scale-105 shadow-xl ring-4 ring-green-100'
                    : 'hover:border-patty-teal hover:bg-patty-teal/5 active:scale-95'
                    }`}
                  disabled={isBuying || isAdded}
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center font-bold animate-in fade-in zoom-in duration-300">
                      <Check size={20} className="mr-2" />
                      Adicionado!
                    </span>
                  ) : (
                    "Adicionar ao Carrinho"
                  )}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  className={`flex-1 shadow-lg transition-all duration-300 ${isBuying
                    ? 'scale-95 opacity-90'
                    : 'hover:-translate-y-1 hover:shadow-xl hover:brightness-105 active:scale-95'
                    }`}
                  disabled={isBuying}
                >
                  {isBuying ? (
                    <span className="flex items-center justify-center">
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    <>
                      <ShoppingBag size={18} className="mr-2" />
                      Comprar Agora
                    </>
                  )}
                </Button>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full text-gray-500 hover:text-patty-teal hover:border-patty-teal hover:bg-patty-teal/10 transition-all duration-300 flex-shrink-0 active:scale-95"
                  title="Compartilhar"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-patty-cream rounded-full text-patty-teal"><Truck size={20} /></div>
                <span>Frete Grátis acima de R$ 299</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-patty-cream rounded-full text-patty-teal"><ShieldCheck size={20} /></div>
                <span>Garantia de 30 dias</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-patty-cream rounded-full text-patty-teal"><Heart size={20} /></div>
                <span>Feito à mão com amor</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 hover:text-patty-coral transition-colors"
                >
                  <div className="p-2 bg-patty-cream rounded-full text-patty-teal"><Share2 size={20} /></div>
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl font-bold text-patty-graphite mb-8 relative inline-block">
              Você também pode gostar
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-patty-coral rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(related => (
                <ProductCard
                  key={related.id}
                  product={related}
                  onNavigate={onNavigate}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-patty-graphite/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowShareModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-bold text-patty-graphite">Compartilhar</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-patty-graphite transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <MessageCircle size={24} />
                </div>
                <span className="text-xs font-medium text-gray-600">WhatsApp</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Facebook size={24} />
                </div>
                <span className="text-xs font-medium text-gray-600">Facebook</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Twitter size={24} />
                </div>
                <span className="text-xs font-medium text-gray-600">Twitter</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Linkedin size={24} />
                </div>
                <span className="text-xs font-medium text-gray-600">LinkedIn</span>
              </a>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Copiar Link</label>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <LinkIcon size={16} className="text-gray-400 ml-2" />
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent border-none text-sm text-gray-600 flex-grow focus:ring-0 w-full"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${linkCopied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-patty-teal/10 text-patty-teal hover:bg-patty-teal/20'
                    }`}
                >
                  {linkCopied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
