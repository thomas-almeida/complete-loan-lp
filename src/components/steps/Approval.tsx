import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { LoanFormData } from '../../types';
import { CheckCircle, FileText, Download, ArrowLeft, PenTool } from 'lucide-react';
import { generateContractPDF } from '../../lib/pdf-generator';

interface ApprovalProps {
  formData: LoanFormData;
  onNext: () => void;
  onBack: () => void;
}

const Approval: React.FC<ApprovalProps> = ({ formData, onNext, onBack }) => {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#3b82f6', '#60a5fa']
    });
  }, []);

  const handleDownload = () => {
    const doc = generateContractPDF(formData);
    doc.save(`contrato-emprestimo-${formData.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  const handlePreview = () => {
    const doc = generateContractPDF(formData);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-green-100 p-4 rounded-full text-green-600">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Empréstimo Aprovado!</h3>
        <p className="text-gray-600">Parabéns, {formData.fullName.split(' ')[0]}! Sua análise de crédito prévia foi aprovada com sucesso.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left space-y-4">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
          <FileText size={18} className="text-green-600" /> Resumo da Proposta
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Valor Total</p>
            <p className="font-bold text-gray-800 text-lg">R$ {formData.amount.toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Parcelamento</p>
            <p className="font-bold text-gray-800 text-lg">{formData.installments}x</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 text-xs">Primeiro Vencimento</p>
            <p className="font-medium text-gray-800">Próximo mês ({new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()).toLocaleDateString('pt-BR')})</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-gray-500">O contrato formal já foi gerado e está pronto para sua assinatura.</p>
        
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="flex-1 border-2 border-green-100 hover:border-green-200 text-green-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <FileText size={18} /> Visualizar
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 border-2 border-green-100 hover:border-green-200 text-green-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Download size={18} /> Baixar
          </button>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all animate-bounce-slow"
        >
          <PenTool size={20} /> Assinar Contrato e Finalizar
        </button>

        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 text-xs font-medium flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft size={12} /> Refazer simulação
        </button>
      </div>
    </div>
  );
};

export default Approval;
