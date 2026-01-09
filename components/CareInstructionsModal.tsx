
import React from 'react';
import { X, Heart, Droplets, Sun, AlertCircle } from 'lucide-react';

interface CareInstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CareInstructionsModal: React.FC<CareInstructionsModalProps> = ({ isOpen, onClose }) => {
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
                        <Heart className="text-patty-mustard fill-current" size={24} />
                        <h2 className="text-xl font-bold font-serif">Cuidados e Carinho</h2>
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
                        <p className="text-lg leading-relaxed text-gray-700 italic border-l-4 border-patty-coral pl-4">
                            Seu amigurumi foi feito 100% à mão, ponto por ponto, com muito amor e dedicação. Para que ele continue lindo e acompanhe você (ou seu pequeno) por muitos anos, ele precisa de alguns cuidados especiais.
                        </p>
                        <p className="font-semibold text-patty-graphite mt-6">Lembre-se: por ser uma peça artesanal, ele é delicado!</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-patty-teal font-bold uppercase tracking-wider text-sm">
                                <Droplets size={18} />
                                <span>Como Lavar</span>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-patty-coral">•</span>
                                    <span><strong>Lavagem à mão:</strong> É a forma mais recomendada. Utilize água fria e sabão neutro.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-patty-coral">•</span>
                                    <span><strong>Movimentos suaves:</strong> Não esfregue vigorosamente. Faça movimentos delicados.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-patty-coral">•</span>
                                    <span><strong>Não deixe de molho:</strong> Evita que a fibra perca textura ou desbote.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-patty-coral">•</span>
                                    <span><strong>Enxágue:</strong> Retire todo o sabão em água corrente.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-patty-teal font-bold uppercase tracking-wider text-sm">
                                <Sun size={18} />
                                <span>Como Secar</span>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-patty-coral">•</span>
                                    <span><strong>Não torça:</strong> Nunca torça seu amigurumi! Isso deforma o enchimento.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-patty-coral">•</span>
                                    <span><strong>Tire o excesso:</strong> Aperte suavemente com as mãos e use uma toalha limpa para absorver a umidade.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-patty-coral">•</span>
                                    <span><strong>Secagem à sombra:</strong> Seque sempre deitado. Pendurar pode esticar os pontos.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-patty-cream rounded-2xl p-6 space-y-4 border border-patty-teal/10">
                        <h3 className="font-bold text-patty-graphite flex items-center gap-2">
                            <AlertCircle size={18} className="text-patty-mustard" />
                            Dicas Extras
                        </h3>
                        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                            <li>• Nunca use alvejantes.</li>
                            <li>• Não passe ferro (calor derrete a fibra).</li>
                            <li>• Use rolinho adesivo para poeira.</li>
                            <li>• Aspirador na mínima potência.</li>
                        </ul>
                    </div>

                    <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                        <h3 className="font-bold text-red-800 flex items-center gap-2 mb-2">
                            <AlertCircle size={18} />
                            Nota de Segurança 🧸
                        </h3>
                        <p className="text-sm text-red-700 leading-relaxed">
                            Embora utilizemos olhos com travas de segurança e costuras reforçadas, a supervisão de um adulto é recomendada durante a brincadeira com crianças menores de 3 anos. Verifique periodicamente se não há partes soltas.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 flex justify-center shrink-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-patty-teal text-white rounded-full font-bold hover:bg-patty-teal/90 transition-all shadow-lg active:scale-95"
                    >
                        Entendi, vou cuidar bem!
                    </button>
                </div>
            </div>
        </div>
    );
};
