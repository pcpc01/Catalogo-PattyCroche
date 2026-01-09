
import React from 'react';
import { Button } from '../components/Button';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export const Contact: React.FC = () => {
  return (
    <div className="animate-fade-in py-16 container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-16 overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">

        {/* Info Column */}
        <div className="bg-patty-teal p-6 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-patty-coral/30 rounded-full blur-3xl"></div>

          <div>
            <h2 className="text-4xl font-bold mb-6">Vamos Conversar?</h2>
            <p className="text-white/80 mb-12 text-lg">
              Tem uma ideia de peça personalizada? Quer tirar dúvidas sobre prazos ou frete? Entre em contato conosco!
            </p>

            <div className="space-y-8">
              <a
                href={`https://wa.me/55${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 hover:opacity-80 transition-opacity group"
              >
                <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Phone className="w-6 h-6 text-patty-mustard" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">WhatsApp</h3>
                  <p className="text-white/80">{CONTACT_INFO.whatsapp}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-patty-mustard" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ateliê</h3>
                  <p className="text-white/80">Taubaté, SP - Brasil</p>
                  <p className="text-xs text-white/60 mt-1">Atendimento apenas online</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h4 className="font-bold mb-4">Siga-nos</h4>
            <div className="flex gap-4">
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-patty-mustard hover:text-patty-graphite transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-patty-mustard hover:text-patty-graphite transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="p-6 md:p-16">

          <h2 className="text-3xl font-bold text-patty-graphite mb-2">Envie uma Mensagem</h2>
          <p className="text-gray-500 mb-8">Preencha o formulário abaixo e retornaremos o mais breve possível.</p>

          <form
            className="space-y-6"
            action="https://formspree.io/f/xojjaqpd"
            method="POST"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="nome"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-patty-teal focus:ring-1 focus:ring-patty-teal outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sobrenome</label>
                <input
                  type="text"
                  name="sobrenome"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-patty-teal focus:ring-1 focus:ring-patty-teal outline-none transition-all"
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-patty-teal focus:ring-1 focus:ring-patty-teal outline-none transition-all"
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Assunto</label>
              <select name="assunto" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-patty-teal focus:ring-1 focus:ring-patty-teal outline-none transition-all">
                <option>Orçamento Personalizado</option>
                <option>Dúvida sobre Produto</option>
                <option>Acompanhar Pedido</option>
                <option>Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mensagem</label>
              <textarea
                name="mensagem"
                rows={4}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-patty-teal focus:ring-1 focus:ring-patty-teal outline-none transition-all resize-none"
                placeholder="Como podemos ajudar?"
              />
            </div>

            <input type="hidden" name="_subject" value="Nova mensagem de contato - PattyCrochê" />

            <Button type="submit" size="lg" className="w-full">
              Enviar Mensagem
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
