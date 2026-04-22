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
  const installmentValue = (amount / installments * 1.05); // 5% monthly fee

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex justify-between">
          <span className="flex items-center gap-2"><DollarSign size={16} /> Valor Pretendido</span>
          <span className="font-bold text-blue-600">R$ {amount.toLocaleString('pt-BR')}</span>
        </label>
        <input
          type="range"
          min="1000"
          max="50000"
          step="500"
          {...register('amount', { valueAsNumber: true })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>R$ 1.000</span>
          <span>R$ 50.000</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar size={16} /> Parcelas
        </label>
        <select
          {...register('installments', { valueAsNumber: true })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}x</option>
          ))}
        </select>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-1">
        <p className="text-xs text-blue-600 font-medium">Estimativa de parcela:</p>
        <p className="text-2xl font-bold text-blue-700">
          {installments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-[10px] text-blue-500">*Taxas inclusas (CET: 1.5% a.m.)</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <QrCode size={16} /> Chave PIX (Para receber o valor)
        </label>
        <input
          {...register('pixKey')}
          placeholder="CPF, E-mail, Celular ou Chave Aleatória"
          className={errors.pixKey ? 'border-red-500' : 'outline-none'}
        />
        {errors.pixKey && <p className="text-red-500 text-xs">{errors.pixKey.message as string}</p>}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <button
          type="submit"
          className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors"
        >
          Ver Resultado
        </button>
      </div>
    </form>
  );
};

export default LoanDetails;
