import { jsPDF } from 'jspdf';
import type { LoanFormData } from '../types';

export const generateContractPDF = (data: LoanFormData) => {
  const doc = new jsPDF();
  const date = new Date();
  const dateStr = date.toLocaleDateString('pt-BR');
  const timeStr = date.toLocaleTimeString('pt-BR');
  const contractNumber = `SBP-${date.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Cores e Estilos
  const primaryBlue = '#1e3a8a'; // Azul Escuro Profissional
  const textDark = '#1f2937';
  const textGray = '#6b7280';
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Helper para texto em negrito
  const boldText = (text: string, x: number, y: number, size = 10) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.text(text, x, y);
    doc.setFont('helvetica', 'normal');
  };

  // --- CABEÇALHO ---
  doc.setTextColor(primaryBlue);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SB Pagamentos', margin, 25);
  
  doc.setTextColor(textGray);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nº ${contractNumber}`, pageWidth - margin, 20, { align: 'right' });
  doc.text(`Emitido em: ${dateStr}`, pageWidth - margin, 26, { align: 'right' });

  // --- TÍTULO ---
  doc.setTextColor(textDark);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO DE MÚTUO FINANCEIRO', pageWidth / 2, 45, { align: 'center' });
  doc.text('(EMPRÉSTIMO PESSOAL)', pageWidth / 2, 53, { align: 'center' });

  // --- PARTES ---
  let y = 70;
  doc.setDrawColor(primaryBlue);
  doc.setLineWidth(1);
  doc.line(margin, y, margin, y + 35); // Linha vertical decorativa

  doc.setFontSize(11);
  doc.setTextColor(textDark);
  
  // Credor
  boldText('CREDOR / BENEFICIÁRIO:', margin + 5, y);
  doc.text('SB PAGAMENTOS LTDA, pessoa jurídica de direito privado,', margin + 60, y);
  doc.text('com sede no Estado de São Paulo, doravante denominada simplesmente "CREDOR".', margin + 5, y + 6);
  
  // Devedor
  y += 18;
  boldText('DEVEDOR:', margin + 5, y);
  doc.text(`${data.fullName}, portador(a) do CPF n.º ${data.cpf},`, margin + 28, y);
  doc.text('doravante denominado(a) simplesmente "DEVEDOR".', margin + 5, y + 6);

  // Introdução
  y += 18;
  const intro = 'As partes acima identificadas têm entre si justo e acordado o presente Contrato de Mútuo Financeiro, o qual se regerá pelas cláusulas e condições a seguir estabelecidas:';
  const introLines = doc.splitTextToSize(intro, pageWidth - (margin * 2));
  doc.text(introLines, margin, y + 5);

  // --- CLÁUSULA 1 ---
  y += 25;
  doc.setTextColor(primaryBlue);
  boldText('CLÁUSULA 1ª – OBJETO', margin, y, 12);
  doc.setTextColor(textDark);
  y += 8;
  const objText = `O CREDOR concede ao DEVEDOR, a título de empréstimo, a quantia de R$ ${data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, cujo valor será disponibilizado ao DEVEDOR mediante transferência bancária via PIX para a chave informada (${data.pixKey}), nesta data ou após confirmação de custas.`;
  const objLines = doc.splitTextToSize(objText, pageWidth - (margin * 2));
  doc.text(objLines, margin, y);

  // --- CLÁUSULA 2 ---
  y += 25;
  doc.setTextColor(primaryBlue);
  boldText('CLÁUSULA 2ª – CONDIÇÕES DE PAGAMENTO', margin, y, 12);
  doc.setTextColor(textDark);
  y += 8;

  // Tabela de Detalhes
  const tableX = margin;
  const tableW = pageWidth - (margin * 2);
  const col2X = margin + 100;
  
  doc.setDrawColor(230, 230, 230);
  doc.line(tableX, y, tableX + tableW, y);
  
  const addTableRow = (label: string, value: string) => {
    y += 8;
    doc.text(label, tableX + 2, y);
    boldText(value, col2X, y);
    y += 2;
    doc.line(tableX, y, tableX + tableW, y);
  };

  const interestRate = 10.00;
  const totalInterest = data.amount * (interestRate / 100);
  const totalToPay = data.amount + totalInterest;
  const installmentValue = totalToPay / data.installments;
  const firstPaymentDate = new Date(date.getFullYear(), date.getMonth() + 1, 15);

  addTableRow('Valor financiado', `R$ ${data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  addTableRow('Taxa de juros', `${interestRate.toFixed(2)}% a.m. (juros simples)`);
  addTableRow('Número de parcelas', `${data.installments}x`);
  addTableRow('Valor de cada parcela', `R$ ${installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  addTableRow('Total a pagar', `R$ ${totalToPay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  addTableRow('Vencimento da 1ª parcela', firstPaymentDate.toLocaleDateString('pt-BR'));

  // --- NOVA PÁGINA ---
  doc.addPage();
  y = 30;

  // --- CLÁUSULA 3 ---
  doc.setTextColor(primaryBlue);
  boldText('CLÁUSULA 3ª – MORA E MULTA', margin, y, 12);
  doc.setTextColor(textDark);
  y += 8;
  const moraText = 'Em caso de atraso no pagamento de qualquer parcela, incidirá: (a) Multa moratória de 2% sobre o valor da parcela; (b) Juros de mora de 1% a.m.; (c) Atualização monetária pelo IPCA/IBGE.';
  doc.text(doc.splitTextToSize(moraText, pageWidth - (margin * 2)), margin, y);

  // --- CLÁUSULA 4 ---
  y += 25;
  doc.setTextColor(primaryBlue);
  boldText('CLÁUSULA 4ª – VENCIMENTO ANTECIPADO', margin, y, 12);
  doc.setTextColor(textDark);
  y += 8;
  const vencText = 'O CREDOR poderá considerar vencida antecipadamente a totalidade da dívida caso o DEVEDOR: (i) deixe de pagar duas ou mais parcelas; (ii) seja declarado insolvente; (iii) forneça informações falsas.';
  doc.text(doc.splitTextToSize(vencText, pageWidth - (margin * 2)), margin, y);

  // --- CLÁUSULA 5 ---
  y += 25;
  doc.setTextColor(primaryBlue);
  boldText('CLÁUSULA 5ª – DISPOSIÇÕES GERAIS', margin, y, 12);
  doc.setTextColor(textDark);
  y += 8;
  const dispText = 'Este contrato é celebrado em caráter irrevogável e irretratável. O presente instrumento constitui título executivo extrajudicial, nos termos do art. 784, III, do Código de Processo Civil.';
  doc.text(doc.splitTextToSize(dispText, pageWidth - (margin * 2)), margin, y);

  // --- CLÁUSULA 6 ---
  y += 25;
  doc.setTextColor(primaryBlue);
  boldText('CLÁUSULA 6ª – FORO', margin, y, 12);
  doc.setTextColor(textDark);
  y += 8;
  doc.text('As partes elegem o foro da Comarca de São Paulo – SP para dirimir quaisquer controvérsias.', margin, y);

  // --- ASSINATURAS ---
  y += 40;
  doc.line(margin, y, margin + 70, y);
  doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
  
  y += 5;
  doc.setFontSize(9);
  doc.text('SB PAGAMENTOS LTDA', margin + 35, y, { align: 'center' });
  doc.text('CREDOR', margin + 35, y + 5, { align: 'center' });
  
  doc.text(data.fullName, pageWidth - margin - 35, y, { align: 'center' });
  doc.text(`CPF: ${data.cpf} — DEVEDOR`, pageWidth - margin - 35, y + 5, { align: 'center' });

  // --- RODAPÉ ---
  const footer = `SB Pagamentos · Contrato Nº ${contractNumber} · Gerado em ${dateStr} às ${timeStr}`;
  doc.setFontSize(8);
  doc.setTextColor(textGray);
  doc.text(footer, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

  return doc;
};
