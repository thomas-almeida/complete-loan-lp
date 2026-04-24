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
      colors: ['#1e3a8a', '#1e40af', '#3b82f6']
    });
  }, []);

  const handleDownload = () => {
    const doc = generateContractPDF(formData);
    doc.save(`contrato-sb-pagamentos-${formData.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  const handlePreview = () => {
    const doc = generateContractPDF(formData);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-blue-50 p-6 rounded-full text-blue-900 shadow-inner">
          <CheckCircle size={56} />
        </div>
        <h3 className="text-3xl font-black text-gray-800 tracking-tighter uppercase mt-2">Aprovado!</h3>
        <p className="text-gray-500 text-sm font-medium">Parabéns, {formData.fullName.split(' ')[0]}! Sua análise de crédito foi concluída com sucesso.</p>
        <p className='text-gray-500 text-sm font-medium'>Agora falta apenas assinar o contrato e realizar o pagamento das custas. Por conta do seu nome estar negativado essa é a segurança que tanto nós como empresa e você precisam ter.</p>
        <p className='text-gray-500 text-sm font-medium'>Fique tranquilo que este é um ambiente <b>100% seguro</b> e auditado e fiscalizado pelo cartório <b>como demanda a Lei</b>.</p>
        <div>
          <img src="/warning.jpeg" className='w-full rounded-lg mt-4 shadow' alt="Aviso" />
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-left space-y-4">
        <h4 className="font-black text-blue-900 text-xs uppercase tracking-widest flex items-center gap-2 border-b border-gray-200 pb-3">
          <FileText size={16} /> Resumo da Proposta Oficial
        </h4>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Valor Solicitado</p>
            <p className="font-black text-gray-800 text-xl">R$ {formData.amount.toLocaleString('pt-BR')}</p>
          </div>
          <div className="col-span-2 bg-white p-3 rounded-xl border border-gray-100">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Custas de Liberação</p>
            <p className="font-bold text-blue-900 break-all">R$ 9,00</p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Parcelamento</p>
            <p className="font-black text-gray-800 text-xl">{formData.installments}x</p>
          </div>
          <div className="col-span-2 bg-white p-3 rounded-xl border border-gray-100">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Chave PIX de Recebimento</p>
            <p className="font-bold text-blue-900 break-all">{formData.pixKey}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
          O seu contrato oficial da SB Pagamentos já foi gerado.<br />Visualize ou baixe para conferir todos os termos.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-gray-200"
          >
            <FileText size={18} /> Visualizar
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-gray-200"
          >
            <Download size={18} /> Baixar
          </button>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 transition-all animate-bounce-slow uppercase tracking-widest text-sm"
        >
          <PenTool size={20} /> Assinar e Finalizar
        </button>

        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 mx-auto pt-2"
        >
          <ArrowLeft size={12} /> Corrigir Dados
        </button>
      </div>
    </div>
  );
};

export default Approval;
