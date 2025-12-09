
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { ProductDetails } from './pages/ProductDetails';
import { PageName, Product } from './types';
import { CartProvider } from './context/CartContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>(() => {
    const savedPage = sessionStorage.getItem('currentPage');
    return (savedPage as PageName) || 'home';
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const savedProduct = sessionStorage.getItem('selectedProduct');
    return savedProduct ? JSON.parse(savedProduct) : null;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  React.useEffect(() => {
    sessionStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  React.useEffect(() => {
    if (selectedProduct) {
      sessionStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
    } else {
      sessionStorage.removeItem('selectedProduct');
    }
  }, [selectedProduct]);

  const handleNavigate = (page: PageName) => {
    if (page === currentPage && page !== 'product-details') return;
    setIsTransitioning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 300);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('product-details');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onViewDetails={handleViewDetails} />;
      case 'catalog':
        return <Catalog onNavigate={handleNavigate} onViewDetails={handleViewDetails} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'product-details':
        return selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            onNavigate={handleNavigate}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <Catalog onNavigate={handleNavigate} onViewDetails={handleViewDetails} />
        );
      default:
        return <Home onNavigate={handleNavigate} onViewDetails={handleViewDetails} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-patty-cream font-sans selection:bg-patty-coral selection:text-white">
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

        <main className={`flex-grow transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {renderPage()}
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
