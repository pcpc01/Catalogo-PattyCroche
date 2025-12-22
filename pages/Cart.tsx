
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Truck, X, Loader2, Bike } from 'lucide-react';
import { PageName } from '../types';
import { calculateNuvemshopPrice, calculateShopeePrice, calculateElo7Price } from '../utils';
import { createOrder } from '../services/orderService';
import { Order } from '../types';

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
  const [selectedShipping, setSelectedShipping] = useState<any | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [fullName, setFullName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState<{ street: string; city: string; state: string } | null>(null);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);

  // Load saved info on mount
  useEffect(() => {
    const savedCep = localStorage.getItem('patty_customer_cep');
    const savedFullName = localStorage.getItem('patty_customer_name');
    const savedAddress = localStorage.getItem('patty_customer_address');

    if (savedCep) setCep(savedCep);
    if (savedFullName) setFullName(savedFullName);
    if (savedAddress) setAddress(JSON.parse(savedAddress));
  }, []);

  const handleCheckout = () => {
    setSelectedItemForWhatsapp(null); // Indicates whole cart checkout
    setIsShippingModalOpen(true);
    // Don't clear CEP/Name/Address here so it persists
    setShippingOptions([]);
    setSelectedShipping(null);
    setShippingError('');
    setIsCheckoutStep(false);
  };

  const handleCalculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setShippingError('Digite um CEP válido (8 dígitos)');
      return;
    }

    let detectedCity = '';

    // Try to get address info from ViaCEP first for validation
    try {
      const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const viaCepData = await viaCepRes.json();
      if (!viaCepData.erro) {
        const addr = {
          street: viaCepData.logradouro,
          city: viaCepData.localidade,
          state: viaCepData.uf
        };
        detectedCity = viaCepData.localidade;
        setAddress(addr);

        // Save to localStorage
        localStorage.setItem('patty_customer_cep', cleanCep);
        localStorage.setItem('patty_customer_address', JSON.stringify(addr));
      } else {
        setShippingError('CEP não encontrado.');
        return;
      }
    } catch (err) {
      console.warn('ViaCEP failed, continuing with Melhor Envio...', err);
    }

    setIsLoadingShipping(true);
    setShippingError('');
    setShippingOptions([]);
    setSelectedShipping(null);

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
        throw new Error('Erro ao calcular frete');
      }

      const data = await response.json();
      let validOptions = data.filter((opt: any) => !opt.error);

      // Add Free Shipping option for Taubaté and Tremembé
      if (detectedCity) {
        const cityNormalized = detectedCity.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (cityNormalized === 'taubate' || cityNormalized === 'tremembe') {
          const freeOption = {
            name: 'Motoboy (Grátis)',
            price: 0,
            delivery_time: '1-2',
            company: {
              name: 'PattyCrochê',
              picture: 'motoboy'
            }
          };
          validOptions = [freeOption, ...validOptions];
        }
      }

      if (data.length > 0 && validOptions.length === 0) {
        setShippingError(`Erro na cotação: ${data[0].error}`);
      } else {
        setShippingOptions(validOptions);
        // Auto-select first option (which will be Free Shipping if available)
        if (validOptions.length > 0) {
          setSelectedShipping(validOptions[0]);
        }
      }
    } catch (error: any) {
      setShippingError(error.message || 'Erro ao calcular frete.');
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
        <h2 className="text-3xl font-bold text-patty-graphite mb-4">Seu carrinho está vazio</h2>
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
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 hidden md:grid grid-cols-12 gap-4 border-b border-gray-100 text-sm font-bold text-patty-graphite/70 uppercase tracking-wider">
              <div className="col-span-6 text-left pl-4">Produto</div>
              <div className="col-span-2 text-center">Quantidade</div>
              <div className="col-span-2 text-center">Preço</div>
              <div className="col-span-2 text-center">Ações</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group hover:bg-patty-cream/30 transition-colors">
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center justify-start gap-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-1">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-patty-graphite text-base">{item.name}</h3>
                      <p className="text-xs text-patty-coral font-medium">{item.category}</p>
                      <p className="md:hidden font-bold text-patty-teal mt-1">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-center">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity || 1)}
                        className="p-2 hover:bg-patty-teal hover:text-white transition-colors text-gray-400"
                        title="Diminuir"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-patty-graphite text-sm">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="p-2 hover:bg-patty-teal hover:text-white transition-colors text-gray-400"
                        title="Aumentar"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Price (Desktop) */}
                  <div className="col-span-1 md:col-span-2 hidden md:flex items-center justify-center">
                    <span className="font-bold text-patty-graphite">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-center">
                    <button
                      onClick={() => handleRemoveClick(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Remover item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer / Total */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Total do Pedido</p>
                  <p className="text-3xl font-bold text-patty-graphite">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full md:w-auto px-12 py-4 text-lg shadow-xl shadow-patty-teal/20"
                >
                  Calcular frete
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </div>
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
      {isShippingModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsShippingModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-patty-cream/20">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Truck className="text-green-600" size={20} />
                </div>
                <h3 className="font-bold text-patty-graphite text-lg">Simular Frete</h3>
              </div>
              <button onClick={() => setIsShippingModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-sm text-gray-600">
                <p className="font-medium text-patty-graphite">Preencha os dados abaixo para fazer a encomenda</p>
              </div>

              {!isCheckoutStep ? (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className="flex-1 px-4 py-2 border-2 border-patty-teal/30 rounded-lg focus:ring-2 focus:ring-patty-teal focus:border-patty-teal outline-none bg-white transition-all shadow-sm"
                    />
                    <Button
                      onClick={handleCalculateShipping}
                      disabled={isLoadingShipping || cep.replace(/\D/g, '').length < 8}
                      size="sm"
                    >
                      {isLoadingShipping ? '...' : 'Calcular'}
                    </Button>
                  </div>

                  {address && (
                    <div className="bg-patty-teal/5 border border-patty-teal/10 p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                      <div className="w-2 h-2 rounded-full bg-patty-teal animate-pulse" />
                      <p className="text-sm font-medium text-patty-graphite">
                        Localizado: <span className="text-patty-teal">{address.city} - {address.state}</span>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-patty-cream/30 p-5 rounded-2xl border-2 border-patty-teal/20 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-4 w-1 bg-patty-teal rounded-full" />
                      <h4 className="text-sm font-bold text-patty-graphite uppercase tracking-wider">Dados de Entrega</h4>
                    </div>

                    <div className="space-y-5">
                      <div className="group">
                        <label className="block text-[10px] font-black text-patty-teal uppercase mb-1.5 tracking-widest flex justify-between">
                          Nome Completo
                          <span className="text-patty-coral">* Obrigatório</span>
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            localStorage.setItem('patty_customer_name', e.target.value);
                          }}
                          placeholder="Digite seu nome completo"
                          className="w-full px-4 py-3 bg-white border-2 border-patty-teal/40 rounded-xl focus:border-patty-teal focus:ring-4 focus:ring-patty-teal/10 outline-none transition-all placeholder:text-gray-300 text-patty-graphite font-bold shadow-sm"
                        />
                      </div>

                      <div className="p-3 bg-white/50 rounded-xl border border-gray-100">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Local de Entrega</label>
                        <p className="text-sm text-patty-graphite font-bold leading-tight">
                          {address?.street && `${address.street}, `}{address?.city} - {address?.state}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 italic">Localizado via CEP {cep}</p>
                      </div>

                      <div className="group">
                        <label className="block text-[10px] font-black text-patty-teal uppercase mb-1.5 tracking-widest flex justify-between">
                          Número da residência
                          <span className="text-patty-coral">* Obrigatório</span>
                        </label>
                        <input
                          type="text"
                          value={houseNumber}
                          onChange={(e) => setHouseNumber(e.target.value)}
                          placeholder="Ex: 123, Bloco A Ap 2..."
                          className="w-full px-4 py-3 bg-white border-2 border-patty-teal/40 rounded-xl focus:border-patty-teal focus:ring-4 focus:ring-patty-teal/10 outline-none transition-all placeholder:text-gray-300 text-patty-graphite font-bold shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={() => setIsCheckoutStep(false)}
                      className="text-xs text-gray-400 hover:text-patty-teal transition-colors flex items-center gap-1 font-bold group"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform">←</span>
                      Voltar para opções de frete
                    </button>
                  </div>
                </div>
              )}

              {shippingError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{shippingError}</p>
              )}

              {shippingOptions.length > 0 && !isCheckoutStep && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  <h4 className="font-medium text-gray-900 text-sm">Selecione uma opção de frete:</h4>
                  <div className="grid gap-2">
                    {shippingOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedShipping(option)}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-all text-left w-full ${selectedShipping === option
                          ? 'border-patty-teal bg-patty-teal/5 ring-2 ring-patty-teal/20'
                          : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {option.company && option.company.picture === 'motoboy' ? (
                            <div className="bg-patty-teal/10 p-2 rounded-lg">
                              <Bike className="text-patty-teal" size={20} />
                            </div>
                          ) : option.company && option.company.picture ? (
                            <img src={option.company.picture} alt={option.name} className="h-6 w-auto object-contain" />
                          ) : null}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{option.name}</p>
                            <p className="text-xs text-gray-500">{option.delivery_time} dias úteis</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <p className="font-bold text-patty-teal text-sm">R$ {Number(option.price).toFixed(2).replace('.', ',')}</p>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedShipping === option ? 'border-patty-teal bg-patty-teal' : 'border-gray-300'}`}>
                            {selectedShipping === option && <div className="w-1.5 h-1.5 rounded-full bg-white animate-scale-in" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={async () => {
                    if (isSubmitting) return;

                    if (!isCheckoutStep) {
                      setIsCheckoutStep(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll modal if needed
                      return;
                    }

                    try {
                      setIsSubmitting(true);
                      setShippingError('');

                      // Generate Order Number
                      const now = new Date();
                      const datePart = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
                      const randomPart = Math.floor(1000 + Math.random() * 9000);
                      const orderNumber = `PC-${datePart}-${randomPart}`;

                      let itemsList = '';
                      const itemsForDb = selectedItemForWhatsapp
                        ? [{ id: selectedItemForWhatsapp.id, name: selectedItemForWhatsapp.name, price: selectedItemForWhatsapp.price, quantity: 1 }]
                        : cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity || 1 }));

                      if (selectedItemForWhatsapp) {
                        itemsList = `*${selectedItemForWhatsapp.name}* - R$ ${selectedItemForWhatsapp.price.toFixed(2).replace('.', ',')}`;
                      } else {
                        itemsList = cartItems.map(item => `- *${item.name}* (x${item.quantity || 1}): R$ ${item.price.toFixed(2).replace('.', ',')}`).join('\n');
                      }

                      const shippingPrice = selectedShipping ? Number(selectedShipping.price) : 0;
                      const finalTotal = cartTotal + shippingPrice;

                      // Save to Database
                      const orderData = { // Changed to 'any' or 'Order' if interface is defined
                        order_number: orderNumber,
                        customer_name: fullName,
                        customer_cep: cep,
                        house_number: houseNumber,
                        items: itemsForDb,
                        total_products: cartTotal,
                        shipping_cost: shippingPrice,
                        shipping_method: selectedShipping ? selectedShipping.name : 'A combinar',
                        total_general: finalTotal,
                        status: 'Pendente'
                      };

                      await createOrder(orderData);

                      // Success - Open WhatsApp
                      const addressText = address
                        ? `\n*Endereço:* ${address.street ? address.street + ', ' : ''}nº ${houseNumber || 'S/N'}, ${address.city} - ${address.state}`
                        : '';
                      const message = `Olá, me chamo *${fullName}* e gostaria de fazer um pedido.` +
                        `\n\n*Número do Pedido: ${orderNumber}*` +
                        `\n\n*Produtos:*\n${itemsList}` +
                        `\n\n*Total dos produtos:* R$ ${cartTotal.toFixed(2).replace('.', ',')}` +
                        (selectedShipping
                          ? `\n\n*Frete selecionado para CEP ${cep}:*${addressText}` +
                          `\n- ${selectedShipping.name}: R$ ${shippingPrice.toFixed(2).replace('.', ',')}` +
                          `\n- Entrega em até ${selectedShipping.delivery_time} dias úteis` +
                          `\n\n*Total Geral:* R$ ${finalTotal.toFixed(2).replace('.', ',')}`
                          : '');

                      const url = `https://wa.me/5512988668359?text=${encodeURIComponent(message)}`;
                      window.open(url, '_blank');
                      setIsShippingModalOpen(false);

                    } catch (error: any) {
                      console.error('Failed to save order', error);
                      setShippingError('Erro ao processar o pedido. Por favor, tente novamente ou entre em contato diretamente.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={(isCheckoutStep && (!fullName.trim() || !houseNumber.trim())) || (!isCheckoutStep && !selectedShipping) || isSubmitting}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-patty-teal hover:bg-patty-teal/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-patty-teal/20 transition-all transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    <>
                      {isCheckoutStep ? 'Encomendar via Whatsapp' : 'Calcular frete'}
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
