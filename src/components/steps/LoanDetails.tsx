import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LoanFormData } from '../../types';
import { DollarSign, Calendar, QrCode, ArrowLeft } from 'lucide-react';

const schema = z.object({
  amount: z.number().min(1000, 'Mínimo R$ 1.000').max(50000, 'Máximo R$ 50.000'),
  installments: z.number().min(1).max(24, 'Máximo 24 parcelas'),
  pixKey: z.string().min(5, 'Chave PIX inválida'),
});

interface LoanDetailsProps {
  onNext: (data: Partial<LoanFormData>) => void;
  onBack: () => void;
  initialData: LoanFormData;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({ onNext, onBack, initialData }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initialData.amount,
      installments: initialData.installments,
      pixKey: initialData.pixKey,
    }
  });

  const amount = watch('amount');
  const installments = watch('installments');
  const installmentValue = (amount / installments * 1.10); // 10% monthly fee example

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700 flex justify-between">
          <span className="flex items-center gap-2"><DollarSign size={16} className="text-blue-900" /> Valor Desejado</span>
          <span className="font-black text-blue-900 text-lg">R$ {amount.toLocaleString('pt-BR')}</span>
        </label>
        <input
          type="range"
          min="1000"
          max="50000"
          step="500"
          {...register('amount', { valueAsNumber: true })}
          className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-900"
        />
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>R$ 1.000</span>
          <span>R$ 50.000</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Calendar size={16} className="text-blue-900" /> Número de Parcelas
        </label>
        <select
          {...register('installments', { valueAsNumber: true })}
          className="w-full"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}x</option>
          ))}
        </select>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-1 text-center">
        <p className="text-[10px] text-blue-900 font-black uppercase tracking-widest">Valor da parcela mensal:</p>
        <p className="text-3xl font-black text-blue-900">
          {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-[10px] text-blue-400 font-bold uppercase mt-2">Liberação Imediata via PIX</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <QrCode size={16} className="text-blue-900" /> Sua Chave PIX (Para Recebimento)
        </label>
        <input
          {...register('pixKey')}
          placeholder="CPF, E-mail ou Celular"
          className={errors.pixKey ? 'border-red-500' : ''}
        />
        {errors.pixKey && <p className="text-red-500 text-xs">{errors.pixKey.message as string}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="submit"
          className="flex-[3] bg-blue-900 hover:bg-blue-800 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all uppercase tracking-widest text-sm"
        >
          Ver Resultado
        </button>
      </div>
    </form>
  );
};

export default LoanDetails;
