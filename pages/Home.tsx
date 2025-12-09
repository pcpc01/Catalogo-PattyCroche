import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ArrowRight, Star, Truck, HeartHandshake, Loader2 } from 'lucide-react';
import { getProducts } from '../services/productService';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SectionHeader } from '../components/SectionHeader';
import { PageName } from '../types';
import { RevealOnScroll } from '../components/RevealOnScroll';

interface HomeProps {
  onNavigate: (page: PageName) => void;
  onViewDetails: (product: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onViewDetails }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg-3.png"
            alt="Crochet Workshop"
            className="w-full h-full object-cover object-right will-change-transform"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-patty-teal/90 via-patty-teal/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <RevealOnScroll animation="fade-right">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full mb-6 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-patty-mustard animate-pulse"></span>
                <span className="text-sm font-medium tracking-wide">Nova Coleção Disponível</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={200}>
              <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
                Arte em <br />
                <span className="text-patty-mustard">Cada Ponto</span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={400}>
              <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-lg leading-relaxed">
                Transformamos fios em memórias. Peças de crochê exclusivas para você, sua casa e quem você ama.
              </p>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={600}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => onNavigate('catalog')} size="lg" className="shadow-xl animate-float">
                  Ver Catálogo
                  <ArrowRight className="ml-2 w-5 h-5 animate-slide-horizontal" />
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Features / Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Star, title: "Qualidade Premium", desc: "Fios 100% algodão e acabamento impecável." },
            { icon: HeartHandshake, title: "Feito à Mão", desc: "Cada peça é única e produzida com carinho." },
            { icon: Truck, title: "Envio para Todo Brasil", desc: "Receba seu pedido no conforto da sua casa." }
          ].map((item, index) => (
            <RevealOnScroll key={index} delay={index * 200} animation="scale">
              <div className="h-full" style={{ transform: `translateY(${scrollY * (0.04 + index * 0.02)}px)` }}>
                <div className="group text-center p-6 rounded-2xl bg-patty-cream hover:bg-white border border-transparent hover:border-patty-teal/20 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full cursor-default">
                  <div className="w-16 h-16 bg-patty-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 text-patty-teal group-hover:bg-patty-teal group-hover:text-white transition-all duration-300">
                    <item.icon size={32} className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-patty-graphite mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-20 bg-patty-cream/50">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <SectionHeader title="Destaques da Semana" subtitle="As peças mais amadas pelos nossos clientes." />
          </RevealOnScroll>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 text-patty-teal animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {featuredProducts.map((product, index) => (
                <RevealOnScroll key={product.id} delay={index * 150} animation="fade-up">
                  <ProductCard product={product} onNavigate={onNavigate} onViewDetails={onViewDetails} />
                </RevealOnScroll>
              ))}
            </div>
          )}

          <div className="text-center">
            <RevealOnScroll delay={200}>
              <Button variant="outline" onClick={() => onNavigate('catalog')} size="lg">
                Ver Todos os Produtos
              </Button>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
};