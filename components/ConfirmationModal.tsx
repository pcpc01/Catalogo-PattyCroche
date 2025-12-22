
import React from 'react';
import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-patty-graphite/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 transform transition-all scale-100 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-patty-graphite transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-patty-mustard/20 text-patty-mustard rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-2xl font-bold text-patty-graphite mb-2">
            {title}
          </h3>

          <p className="text-gray-500 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-4 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              className="flex-1 !bg-patty-coral text-white hover:!bg-[#C06058]"
            >
              Sim, remover
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
