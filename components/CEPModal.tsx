import React, { useState } from 'react';
import { X, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Product } from '../types';
import { CONTACT_INFO } from '../constants';

interface CEPModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    quantity?: number;
}

export const CEPModal: React.FC<CEPModalProps> = ({ isOpen, onClose, product, quantity = 1 }) => {
    const [cep, setCep] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Mask CEP as 00000-000
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        setCep(value);
        setError('');
    };

    const handleConfirm = async () => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            setError('CEP inválido. Digite 8 números.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setError('CEP não encontrado.');
                setLoading(false);
                return;
            }

            const city = data.localidade;
            const normalizedCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

            // Check for Taubaté or Tremembé (robust comparison)
            const isLocal = normalizedCity === 'taubate' || normalizedCity === 'tremembe';


            if (isLocal) {
                // WhatsApp Redirect
                const phoneNumber = CONTACT_INFO.whatsapp.replace(/\D/g, '');
                const qtyText = quantity > 1 ? ` (${quantity} unidades)` : '';
                const message = encodeURIComponent(`Olá, gostaria de encomendar o produto "${product.name}"${qtyText}. (CEP: ${cep})`);
                const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${message}`;
                window.open(whatsappUrl, '_blank');
            } else {
                // Nuvemshop Redirect
                if (product.nuvemshop_link) {
                    window.open(product.nuvemshop_link, '_blank');
                } else {
                    // Fallback if no link
                    setError('Este produto não tem link da Loja disponível. Entre em contato pelo WhatsApp.');
                    // Or just redirect to WhatsApp anyway? The prompt says "abre o link".
                    // If I can't open link, I'll error.
                    // Alternatively, I could fallback to WhatsApp after a delay.
                    // Let's stick to error for now, or maybe log it.
                    // Actually, let's offer WhatsApp as fallback button if link missing.
                }
            }
            onClose();
        } catch (err) {
            setError('Erro ao consultar CEP. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-patty-graphite/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-slide-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-patty-graphite transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-patty-teal/10 text-patty-teal rounded-full flex items-center justify-center mb-6">
                        <MapPin size={32} />
                    </div>

                    <h3 className="text-2xl font-bold text-patty-graphite mb-2">
                        Informe seu CEP
                    </h3>

                    <p className="text-gray-500 mb-6 text-sm">
                        Para verificar a disponibilidade de entrega e opções de compra para <strong>{product.name}</strong>.
                    </p>

                    <div className="w-full mb-6">
                        <input
                            type="text"
                            value={cep}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            className="w-full text-center text-2xl font-bold text-patty-graphite border-2 border-gray-200 rounded-xl p-3 focus:border-patty-teal focus:ring-0 outline-none transition-all placeholder:text-gray-300"
                            maxLength={9}
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
                                <AlertCircle size={14} />
                                {error}
                            </p>
                        )}
                        <a
                            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-patty-teal hover:underline mt-2 inline-block"
                        >
                            Não sei meu CEP
                        </a>
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        className="w-full py-3 text-lg"
                        disabled={loading || cep.length < 9}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin mr-2" />
                                Verificando...
                            </>
                        ) : (
                            'Continuar'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
