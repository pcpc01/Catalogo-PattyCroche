import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { RevealOnScroll } from '../components/RevealOnScroll';

export const About: React.FC = () => {
  return (
    <div>
      {/* Header Banner */}
      <div className="bg-patty-teal py-20 text-center text-white">
        <RevealOnScroll animation="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold">Quem Somos</h1>
          <p className="mt-4 text-white/80 max-w-xl mx-auto">Conheça a história e as mãos por trás de cada ponto.</p>
        </RevealOnScroll>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Image Side */}
          <RevealOnScroll animation="fade-right">
            <div className="relative">
              <div className="absolute top-4 -left-4 w-full h-full border-2 border-patty-mustard rounded-2xl z-0"></div>
              <img
                src="https://picsum.photos/id/65/800/1000"
                alt="Artesã trabalhando"
                className="relative z-10 w-full rounded-2xl shadow-xl object-cover aspect-[4/5]"
              />
              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-patty-coral text-white p-6 rounded-full shadow-lg w-32 h-32 flex flex-col items-center justify-center text-center animate-bounce-slow">
                <span className="text-3xl font-bold">10+</span>
                <span className="text-xs uppercase tracking-wide">Anos de<br />Experiência</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Text Side */}
          <div>
            <RevealOnScroll animation="fade-left" delay={200}>
              <span className="text-patty-coral font-bold tracking-widest uppercase text-sm mb-2 block">Nossa História</span>
              <h2 className="text-3xl md:text-4xl font-bold text-patty-graphite mb-6">
                Amor pelo artesanato passado de geração em geração.
              </h2>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Olá! Sou a Patrícia, a criadora da <strong>PattyCrochê</strong>. Minha jornada com as agulhas começou ainda na infância, observando minha avó criar toalhas e roupas incríveis apenas com um fio e uma agulha.
                </p>
                <p>
                  O que começou como um hobby terapêutico se transformou em uma verdadeira paixão e, posteriormente, em profissão. Acredito que o crochê não é apenas uma técnica manual, mas uma forma de transmitir carinho, conforto e personalidade.
                </p>
                <p>
                  Hoje, nossa missão é levar peças modernas e sofisticadas para a casa e o guarda-roupa de pessoas que valorizam o "feito à mão". Utilizamos apenas materiais premium e sustentáveis, garantindo que cada peça não seja apenas bonita, mas também durável.
                </p>
              </div>

              {/* Signature Area */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="italic text-2xl text-patty-teal">Patrícia Silva</p>
                <p className="text-sm text-gray-400">Fundadora & Artesã</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-patty-cream py-20">
        <div className="container mx-auto px-4">
          <RevealOnScroll>
            <SectionHeader title="Nossos Valores" />
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { title: "Sustentabilidade", desc: "Uso consciente de materiais e redução de desperdício." },
              { title: "Exclusividade", desc: "Peças únicas, nunca produzimos duas exatamente iguais." },
              { title: "Afeto", desc: "Cada pedido é embalado como um presente especial." }
            ].map((val, idx) => (
              <RevealOnScroll key={idx} delay={idx * 200} animation="fade-up">
                <div className="bg-white p-8 rounded-xl shadow-sm text-center border-b-4 border-patty-mustard h-full">
                  <h3 className="text-xl font-bold text-patty-graphite mb-3">{val.title}</h3>
                  <p className="text-gray-500">{val.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};