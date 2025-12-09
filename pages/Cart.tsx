
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Truck, X } from 'lucide-react';
import { PageName } from '../types';
import { calculateNuvemshopPrice, calculateShopeePrice, calculateElo7Price } from '../utils';

interface CartProps {
  onNavigate: (page: PageName) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  // Shipping Modal State
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [selectedItemForWhatsapp, setSelectedItemForWhatsapp] = useState<any | null>(null);

  // Shipping Calculation State
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');

  const handleWhatsappClick = (item: any) => {
    setSelectedItemForWhatsapp(item);
    setIsShippingModalOpen(true);
    setCep(''); // Clear CEP when opening modal for a new item
    setShippingOptions([]);
    setShippingError('');
  };

  const handleCalculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setShippingError('Digite um CEP válido (8 dígitos)');
      return;
    }

    setIsLoadingShipping(true);
    setShippingError('');
    setShippingOptions([]);

    // Use selected item for calculation if available, otherwise use all cart items (fallback)
    const itemsToCalculate = selectedItemForWhatsapp ? [selectedItemForWhatsapp] : cartItems;

    try {
      const payload = {
        from: {
          postal_code: "12061000"
        },
        to: {
          postal_code: cleanCep
        },
        products: itemsToCalculate.map((item: any) => {
          // Melhor Envio expects weight in KG. If weight > 1, assume it's in grams and convert.
          // Default to 0.3kg if missing.
          const weightInKg = item.weight ? (item.weight > 5 ? item.weight / 1000 : item.weight) : 0.3;

          // Enforce minimum dimensions for carriers (usually min 11x16x2 cm)
          const width = Math.max(Number(item.width) || 11, 11);
          const height = Math.max(Number(item.height) || 2, 2);
          const length = Math.max(Number(item.length) || 16, 16);

          return {
            id: item.id.toString(),
            width: width,
            height: height,
            length: length,
            weight: weightInKg,
            insurance_value: Number(item.price),
            quantity: item.quantity
          };
        })
      };

      console.log('Shipping Payload:', JSON.stringify(payload, null, 2));
      const token = import.meta.env.VITE_MELHOR_ENVIO_TOKEN;
      console.log('Token prefix:', token ? token.substring(0, 20) : 'No token found');

      // Use proxy URL to avoid CORS
      const response = await fetch('/api/melhorenvio/me/shipment/calculate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MELHOR_ENVIO_TOKEN}`,
          'User-Agent': 'AplicaçãoPattyCroche (pcpc01@gmail.com)'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Erro API ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);

      // Filter out options with errors if any
      const validOptions = data.filter((opt: any) => !opt.error);

      if (data.length > 0 && validOptions.length === 0) {
        console.warn('All options have errors:', data);
        const firstError = data[0].error;
        setShippingError(`Erro na cotação: ${firstError}`);
      } else {
        setShippingOptions(validOptions);
      }

      if (validOptions.length === 0 && data.length === 0) {
        setShippingError('Nenhuma opção de frete disponível para este CEP.');
      }

    } catch (error: any) {
      console.error('Erro detalhado:', error);
      setShippingError(error.message || 'Erro ao calcular frete. Verifique o CEP.');
    } finally {
      setIsLoadingShipping(false);
    }
  };

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

      <div className="max-w-3xl mx-auto">

        {/* Cart Items List */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 hidden md:grid grid-cols-12 gap-4 border-b border-gray-100 text-sm font-bold text-patty-graphite/70 uppercase tracking-wider">
              <div className="col-span-6 text-center">Produto</div>
              <div className="col-span-6 text-center">Opções de Compra</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group hover:bg-patty-cream/30 transition-colors">

                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center justify-center gap-4">
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-serif font-bold text-patty-graphite text-lg">{item.name}</h3>
                      <p className="text-sm text-patty-coral font-medium mb-1">{item.category}</p>

                      {/* Mobile Price/Link Display */}
                      <div className="md:hidden space-y-2 mt-3">
                        {item.nuvemshop_link && (
                          <a
                            href={item.nuvemshop_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-blue-800 text-blue-800 bg-blue-50/50 active:bg-blue-100 transition-colors text-sm"
                          >
                            <span className="font-semibold">Nuvem</span>
                            <span className="font-bold">R$ {calculateNuvemshopPrice(item.price).toFixed(2).replace('.', ',')}</span>
                          </a>
                        )}
                        {item.shopee_link && (
                          <a
                            href={item.shopee_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-orange-500 text-orange-600 bg-orange-50/50 active:bg-orange-100 transition-colors text-sm"
                          >
                            <span className="font-semibold">Shopee</span>
                            <span className="font-bold">R$ {calculateShopeePrice(item.price).toFixed(2).replace('.', ',')}</span>
                          </a>
                        )}
                        {item.elo7_link && (
                          <a
                            href={item.elo7_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-yellow-500 text-yellow-700 bg-yellow-50/50 active:bg-yellow-100 transition-colors text-sm"
                          >
                            <span className="font-semibold">Elo7</span>
                            <span className="font-bold">R$ {calculateElo7Price(item.price).toFixed(2).replace('.', ',')}</span>
                          </a>
                        )}
                        <button
                          onClick={() => handleWhatsappClick(item)}
                          className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-green-500 text-green-700 bg-green-50/50 active:bg-green-100 transition-colors text-sm"
                        >
                          <span className="font-semibold">Whatsapp</span>
                          <span className="font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                        </button>
                      </div>


                    </div>
                  </div>



                  {/* Price & Links (Desktop) */}
                  <div className="col-span-1 md:col-span-6 hidden md:flex items-start justify-center gap-4">
                    <div className="flex flex-col gap-2 w-full max-w-[200px]">
                      {item.nuvemshop_link && (
                        <a
                          href={item.nuvemshop_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-between px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-800 text-blue-800 bg-blue-50/30 hover:bg-blue-50 transition-all cursor-pointer"
                          title="Comprar na Nuvemshop"
                        >
                          <span className="text-xs font-semibold uppercase tracking-wide opacity-70 group-hover/btn:opacity-100">Nuvem</span>
                          <span className="font-bold text-sm">R$ {calculateNuvemshopPrice(item.price).toFixed(2).replace('.', ',')}</span>
                        </a>
                      )}
                      {item.shopee_link && (
                        <a
                          href={item.shopee_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-between px-3 py-2 rounded-lg border border-orange-200 hover:border-orange-500 text-orange-600 bg-orange-50/30 hover:bg-orange-50 transition-all cursor-pointer"
                          title="Comprar na Shopee"
                        >
                          <span className="text-xs font-semibold uppercase tracking-wide opacity-70 group-hover/btn:opacity-100">Shopee</span>
                          <span className="font-bold text-sm">R$ {calculateShopeePrice(item.price).toFixed(2).replace('.', ',')}</span>
                        </a>
                      )}
                      {item.elo7_link && (
                        <a
                          href={item.elo7_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-between px-3 py-2 rounded-lg border border-yellow-200 hover:border-yellow-500 text-yellow-700 bg-yellow-50/30 hover:bg-yellow-50 transition-all cursor-pointer"
                          title="Comprar no Elo7"
                        >
                          <span className="text-xs font-semibold uppercase tracking-wide opacity-70 group-hover/btn:opacity-100">Elo7</span>
                          <span className="font-bold text-sm">R$ {calculateElo7Price(item.price).toFixed(2).replace('.', ',')}</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleWhatsappClick(item)}
                        className="group/btn flex items-center justify-between px-3 py-2 rounded-lg border border-green-200 hover:border-green-500 text-green-700 bg-green-50/30 hover:bg-green-50 transition-all cursor-pointer w-full"
                        title="Encomendar via Whatsapp"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide opacity-70 group-hover/btn:opacity-100">Whatsapp</span>
                        <span className="font-bold text-sm">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveClick(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all mt-1"
                      title="Remover item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-6">
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center text-patty-teal hover:text-patty-graphite transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continuar Comprando
          </button>
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

      {/* Shipping Modal */}
      {isShippingModalOpen && selectedItemForWhatsapp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsShippingModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-patty-cream/20">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Truck className="text-green-600" size={20} />
                </div>
                <h3 className="font-serif font-bold text-patty-graphite text-lg">Simular Frete</h3>
              </div>
              <button onClick={() => setIsShippingModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-600">
                Você está interessado em: <span className="font-semibold text-patty-graphite">{selectedItemForWhatsapp.name}</span>.
                <br />
                Digite seu CEP abaixo para simular o frete antes de ir para o WhatsApp.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-patty-teal focus:border-transparent outline-none"
                />
                <Button
                  onClick={handleCalculateShipping}
                  disabled={isLoadingShipping || cep.replace(/\D/g, '').length < 8}
                  size="sm"
                >
                  {isLoadingShipping ? '...' : 'Calcular'}
                </Button>
              </div>

              {shippingError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{shippingError}</p>
              )}

              {shippingOptions.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  <h4 className="font-medium text-gray-900 text-sm">Opções encontradas:</h4>
                  <div className="grid gap-2">
                    {shippingOptions.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          {option.company && option.company.picture && (
                            <img src={option.company.picture} alt={option.name} className="h-6 w-auto object-contain" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{option.name}</p>
                            <p className="text-xs text-gray-500">{option.delivery_time} dias úteis</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-patty-teal text-sm">R$ {Number(option.price).toFixed(2).replace('.', ',')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <a
                  href={`https://wa.me/5512988668359?text=${encodeURIComponent(
                    `Olá, gostaria de encomendar o produto: *${selectedItemForWhatsapp.name}*` +
                    `\nValor do produto: R$ ${selectedItemForWhatsapp.price.toFixed(2).replace('.', ',')}` +
                    (shippingOptions.length > 0
                      ? `\n\nSimulação de Frete para CEP ${cep}:` +
                      shippingOptions.map(opt => `\n- ${opt.name} (${opt.delivery_time} dias): R$ ${Number(opt.price).toFixed(2).replace('.', ',')}`).join('')
                      : '')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5"
                  onClick={() => setIsShippingModalOpen(false)}
                >
                  Continuar para WhatsApp
                  <ArrowRight size={18} className="ml-2" />
                </a>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Você pode prosseguir mesmo sem calcular o frete.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
