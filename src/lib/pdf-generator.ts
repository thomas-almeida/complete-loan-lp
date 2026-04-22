import { jsPDF } from 'jspdf';
import type { LoanFormData } from '../types';

export const generateContractPDF = (data: LoanFormData) => {
  const doc = new jsPDF();
  const date = new Date();
  const firstPaymentDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  
  const formattedFirstPayment = firstPaymentDate.toLocaleDateString('pt-BR');
  const installmentValue = (data.amount / data.installments * 1.05).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // 5% hypothetical interest

  doc.setFontSize(18);
  doc.text('CONTRATO DE EMPRÉSTIMO PESSOAL', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const content = `
    Pelo presente instrumento particular, de um lado a Instituição Financeira Credora e de outro lado:

    MUTUÁRIO: ${data.fullName}
    CPF: ${data.cpf}
    WHATSAPP: ${data.whatsapp}
    CHAVE PIX PARA RECEBIMENTO: ${data.pixKey}

    1. OBJETO DO CONTRATO
    O presente contrato tem como objeto o empréstimo do valor de R$ ${data.amount.toLocaleString('pt-BR')} (extenso: ${data.amount} reais).

    2. CONDIÇÕES DE PAGAMENTO
    O mutuário compromete-se a pagar o valor acima em ${data.installments} parcelas mensais e sucessivas no valor estimado de ${installmentValue} cada.
    A primeira parcela terá vencimento em ${formattedFirstPayment}.

    3. LIBERAÇÃO DO CRÉDITO
    A liberação do crédito ocorrerá na chave PIX informada pelo mutuário em até 24 horas úteis após a formalização deste contrato e o pagamento das custas cartorárias.

    4. CUSTAS E TAXAS
    Fica acordado que as custas de registro em cartório para firmar este contrato oficialmente são de responsabilidade do mutuário, devendo ser pagas via PIX conforme instruções no sistema.

    5. FORO
    As partes elegem o foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas oriundas deste contrato.

    São Paulo, ${date.toLocaleDateString('pt-BR')}

    __________________________________________
    ${data.fullName}
    (Assinado Digitalmente)
  `;

  const splitContent = doc.splitTextToSize(content, 180);
  doc.text(splitContent, 15, 40);

  return doc;
};
