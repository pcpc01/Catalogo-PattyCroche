
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { PageName } from '../types';

interface CartProps {
  onNavigate: (page: PageName) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  // Helper to handle quantity decrease logic
  const handleDecreaseQuantity = (id: number, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      setItemToRemove(id);
    } else {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  // Helper to handle direct removal click
  const handleRemoveClick = (id: number) => {
    setItemToRemove(id);
  };

  // Confirm removal action
  const confirmRemoval = () => {
    if (itemToRemove !== null) {
      removeFromCart(itemToRemove);
      setItemToRemove(null);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 animate-fade-in text-center">
        <div className="bg-patty-teal/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={48} className="text-patty-teal" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-patty-graphite mb-4">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Parece que você ainda não escolheu nenhuma de nossas peças exclusivas. Que tal dar uma olhada no catálogo?
        </p>
        <Button onClick={() => onNavigate('catalog')} size="lg">
          Voltar para o Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      <SectionHeader title="Seu Carrinho" subtitle="Revise suas escolhas antes de finalizar." />

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 hidden md:grid grid-cols-12 gap-4 border-b border-gray-100 text-sm font-bold text-patty-graphite/70 uppercase tracking-wider">
              <div className="col-span-6">Produto</div>
              <div className="col-span-3 text-center">Quantidade</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group hover:bg-patty-cream/30 transition-colors">
                  
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-patty-graphite text-lg">{item.name}</h3>
                      <p className="text-sm text-patty-coral font-medium mb-1">{item.category}</p>
                      <p className="text-sm text-gray-500 md:hidden">
                        R$ {item.price.toFixed(2).replace('.', ',')} un.
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-1 md:col-span-3 flex items-center justify-start md:justify-center">
                    <div className="flex items-center border border-gray-200 rounded-full bg-white">
                      <button 
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-patty-teal transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium text-patty-graphite">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-patty-teal transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveClick(item.id)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all md:hidden"
                      title="Remover item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Price & Remove (Desktop) */}
                  <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end gap-4">
                    <span className="font-bold text-patty-teal text-lg">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                    <button 
                      onClick={() => handleRemoveClick(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all hidden md:block"
                      title="Remover item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('catalog')}
            className="flex items-center text-patty-teal hover:text-patty-graphite transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continuar Comprando
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h3 className="font-serif text-xl font-bold text-patty-graphite mb-6">Resumo do Pedido</h3>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete (Estimado)</span>
                <span className="text-patty-teal font-medium">Grátis</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-bold text-patty-graphite">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <Button className="w-full justify-between group shadow-lg" size="lg">
              Finalizar Compra
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="mt-4 text-xs text-center text-gray-400">
              Transação segura e criptografada. Aceitamos cartões e PIX.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={itemToRemove !== null}
        onClose={() => setItemToRemove(null)}
        onConfirm={confirmRemoval}
        title="Remover produto?"
        message="Tem certeza que deseja remover este item do seu carrinho?"
      />
    </div>
  );
};
