import React from 'react';
import { useForm } from 'react-hook-form';
import type { LoanFormData } from '../../types';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface QuestionStepProps {
  question: string;
  description?: string;
  fieldName: keyof LoanFormData;
  options: string[];
  onNext: (data: Partial<LoanFormData>) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  initialData: LoanFormData;
}

const QuestionStep: React.FC<QuestionStepProps> = ({ 
  question, 
  fieldName, 
  options, 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps,
  initialData 
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { [fieldName]: initialData[fieldName] }
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-2 py-1 rounded">
          Passo {currentStep} de {totalSteps}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-4 rounded-full ${i + 1 <= currentStep ? 'bg-blue-900' : 'bg-gray-100'}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">
          {question}
        </h3>
        
        <div className="grid gap-3">
          {options.map((opt) => (
            <label 
              key={opt} 
              className="group flex items-center gap-3 p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-900 hover:bg-blue-50 cursor-pointer transition-all active:scale-[0.98]"
            >
              <input 
                type="radio" 
                {...register(fieldName as any)} 
                value={opt} 
                required 
                className="w-5 h-5 text-blue-900 border-gray-300 focus:ring-blue-900" 
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-900 transition-colors">
                {opt}
              </span>
            </label>
          ))}
        </div>
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
          className="flex-[3] bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
        >
          Continuar <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default QuestionStep;
