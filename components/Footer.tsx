
import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants';
import { Instagram, Heart } from 'lucide-react';
import { CareInstructionsModal } from './CareInstructionsModal';
import { ShippingPolicyModal } from './ShippingPolicyModal';

export const Footer: React.FC = () => {
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

  return (
    <footer className="bg-white text-patty-graphite pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <img
              src="https://res.cloudinary.com/duljbwers/image/upload/v1764761186/ai_studio_1764685738763_1_zy6guk.png"
              alt="PattyCrochê"
              className="h-16 w-auto mb-2"
            />
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Levando arte e aconchego para o seu lar através de peças exclusivas feitas à mão com os melhores materiais do mercado.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-patty-teal uppercase tracking-wider text-sm">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button
                  onClick={() => setIsShippingModalOpen(true)}
                  className="hover:text-patty-coral transition-colors"
                >
                  Política de Envio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCareModalOpen(true)}
                  className="hover:text-patty-coral transition-colors"
                >
                  Como Cuidar das Peças
                </button>
              </li>
              <li><button className="hover:text-patty-coral transition-colors">Perguntas Frequentes</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-patty-teal uppercase tracking-wider text-sm">Contato</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href={`https://wa.me/55${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-patty-coral transition-colors"
                >
                  {CONTACT_INFO.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2 pt-2">
                <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-patty-coral transition-colors"><Instagram size={20} /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2024 PattyCrochê. Todos os direitos reservados.</p>
          <p className="flex items-center mt-2 md:mt-0">
            Feito com <Heart size={12} className="mx-1 text-patty-coral fill-current" /> por PattyCrochê
          </p>
        </div>
      </div>

      <CareInstructionsModal
        isOpen={isCareModalOpen}
        onClose={() => setIsCareModalOpen(false)}
      />

      <ShippingPolicyModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
      />
    </footer>
  );
};
