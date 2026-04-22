import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LoanFormData } from '../../types';
import { User, CreditCard, MessageCircle } from 'lucide-react';

const schema = z.object({
  fullName: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().min(14, 'CPF inválido'),
  whatsapp: z.string().min(14, 'WhatsApp inválido'),
});

interface BasicInfoProps {
  onNext: (data: Partial<LoanFormData>) => void;
  initialData: LoanFormData;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ onNext, initialData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: initialData.fullName,
      cpf: initialData.cpf,
      whatsapp: initialData.whatsapp,
    }
  });

  const handleCpfMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setValue('cpf', value.slice(0, 14));
  };

  const handlePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    setValue('whatsapp', value.slice(0, 15));
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <User size={16} /> Nome Completo
        </label>
        <input
          {...register('fullName')}
          placeholder="Digite seu nome completo"
          className={errors.fullName ? 'border-red-500' : 'outline-none'}
        />
        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message as string}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <CreditCard size={16} /> CPF
        </label>
        <input
          {...register('cpf')}
          placeholder="000.000.000-00"
          onChange={handleCpfMask}
          className={errors.cpf ? 'border-red-500' : 'outline-none'}
        />
        {errors.cpf && <p className="text-red-500 text-xs">{errors.cpf.message as string}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MessageCircle size={16} /> WhatsApp
        </label>
        <input
          {...register('whatsapp')}
          placeholder="(00) 00000-0000"
          onChange={handlePhoneMask}
          className={errors.whatsapp ? 'border-red-500' : 'outline-none'}
        />
        {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp.message as string}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors mt-4"
      >
        Simular Agora
      </button>
    </form>
  );
};

export default BasicInfo;
