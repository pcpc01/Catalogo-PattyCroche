
import React from 'react';
import { X, Truck, Calendar, Box, Package, Heart } from 'lucide-react';

interface ShippingPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShippingPolicyModal: React.FC<ShippingPolicyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-patty-graphite/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden transform transition-all animate-scale-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-patty-teal p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <Truck className="text-patty-mustard" size={24} />
                        <h2 className="text-xl font-bold font-serif">Política de Prazos e Envio</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar space-y-8">
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
                        <p className="text-lg leading-relaxed text-gray-700 italic border-l-4 border-patty-mustard pl-4">
                            Aqui, cada peça é única e feita especialmente para você! Diferente de produtos industrializados, o amigurumi requer tempo, atenção e carinho em cada ponto.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="bg-patty-cream p-4 rounded-2xl h-max text-patty-teal shrink-0">
                                <Calendar size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-patty-graphite text-lg">1. Prazo de Produção e Postagem</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Como trabalhamos com peças feitas à mão e sob encomenda, nosso prazo para confecção e postagem é de <strong>15 dias úteis</strong> após a confirmação do pagamento.
                                </p>
                                <div className="bg-patty-cream px-3 py-1 rounded-md text-xs text-patty-teal inline-block font-medium">
                                    Nota: Dias úteis não incluem sábados, domingos e feriados.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-patty-cream p-4 rounded-2xl h-max text-patty-teal shrink-0">
                                <Box size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-patty-graphite text-lg">2. Prazo de Entrega</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Após a postagem (respeitando o prazo de 15 dias úteis acima), passa a valer o prazo da transportadora escolhida (Correios, Jadlog, etc.) para o seu CEP.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-patty-cream p-4 rounded-2xl h-max text-patty-teal shrink-0">
                                <Package size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-patty-graphite text-lg">3. Rastreamento</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Assim que seu pedido for postado, você receberá o código de rastreio por e-mail para acompanhar a viagem do seu novo amigurumi até sua casa.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-patty-teal font-medium flex items-center justify-center gap-2">
                            <Heart size={16} className="text-patty-coral fill-current" />
                            Agradecemos a compreensão e garantimos: a espera valerá a pena!
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 flex justify-center shrink-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-patty-teal text-white rounded-full font-bold hover:bg-patty-teal/90 transition-all shadow-lg active:scale-95"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};
