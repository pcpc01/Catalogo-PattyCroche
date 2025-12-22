import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/productService';
import { Category, PageName, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SectionHeader } from '../components/SectionHeader';
import { Search, Loader2, ArrowUpDown } from 'lucide-react';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface CatalogProps {
  onNavigate: (page: PageName) => void;
  onViewDetails: (product: any) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onNavigate, onViewDetails }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<string>('name-asc'); // Default sort: Name A - Z
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err: any) {
        console.error("Failed to load data", err);
        setError(err.message || "Erro ao carregar dados. Verifique o console.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isVisible = product.show_in_catalog === true;
    return matchesCategory && matchesSearch && isVisible;
  }).sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'promotional':
        // Items on sale first, then by newness (id)
        if (a.isOnSale && !b.isOnSale) return -1;
        if (!a.isOnSale && b.isOnSale) return 1;
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <RevealOnScroll>
        <SectionHeader
          title="Nossa Coleção"
          subtitle="Peças exclusivas feitas à mão com amor e dedicação em cada ponto."
        />
      </RevealOnScroll>

      {/* Search Bar */}
      {/* Search and Filter Bar */}
      <RevealOnScroll delay={100} animation="fade-up">
        <div className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-patty-teal transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full leading-5 text-patty-graphite placeholder-gray-400 focus:outline-none focus:border-patty-teal focus:ring-1 focus:ring-patty-teal shadow-sm transition-all duration-300 hover:shadow-md"
            />
          </div>

          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none block w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-full leading-5 text-patty-graphite focus:outline-none focus:border-patty-teal focus:ring-1 focus:ring-patty-teal shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <option value="promotional">Destaques</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
              <option value="name-asc">Nome: A - Z</option>
              <option value="name-desc">Nome: Z - A</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* Filters */}
      <RevealOnScroll delay={200} animation="fade-up">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95
                ${activeCategory === cat
                  ? 'bg-patty-teal text-white shadow-lg scale-105'
                  : 'bg-white text-patty-graphite border border-gray-200 hover:border-patty-teal hover:text-patty-teal hover:shadow-md'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Ops! </strong>
          <span className="block sm:inline">{error}</span>
          <p className="text-sm mt-1">Tente reiniciar o servidor (npm run dev) se acabou de configurar o Supabase.</p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-patty-teal animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <RevealOnScroll key={product.id} delay={index * 100} animation="fade-up">
              <ProductCard product={product} onNavigate={onNavigate} onViewDetails={onViewDetails} />
            </RevealOnScroll>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <RevealOnScroll animation="fade-up">
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-patty-graphite font-medium text-lg mb-2">Nenhum produto encontrado</p>
            <p className="text-gray-500">Tente buscar por outro termo ou mude a categoria.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('Todos') }}
              className="mt-4 text-patty-teal hover:underline font-medium text-sm"
            >
              Limpar filtros
            </button>
          </div>
        </RevealOnScroll>
      )}
    </div>
  );
};