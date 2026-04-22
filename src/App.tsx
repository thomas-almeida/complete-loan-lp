import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LoanFormData, Step } from './types';
import BasicInfo from './components/steps/BasicInfo';
import LoanDetails from './components/steps/LoanDetails';
import Approval from './components/steps/Approval';
import Payment from './components/steps/Payment';
import { Landmark, Loader2, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('basic-info');
  const [formData, setFormData] = useState<LoanFormData>({
    fullName: '',
    cpf: '',
    whatsapp: '',
    amount: 5000,
    installments: 12,
    pixKey: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const nextStep = (next: Step) => setStep(next);

  const handleLoanDetailsSubmit = (data: Partial<LoanFormData>) => {
    updateFormData(data);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      nextStep('approval');
    }, 3000);
  };

  const updateFormData = (data: Partial<LoanFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const steps: Record<Step, { title: string; component: React.ReactNode }> = {
    'basic-info': {
      title: 'Informações Básicas',
      component: <BasicInfo onNext={(data) => { updateFormData(data); nextStep('loan-details'); }} initialData={formData} />,
    },
    'loan-details': {
      title: 'Simulação de Empréstimo',
      component: <LoanDetails onNext={handleLoanDetailsSubmit} onBack={() => nextStep('basic-info')} initialData={formData} />,
    },
    'approval': {
      title: 'Proposta Aprovada',
      component: <Approval formData={formData} onNext={() => nextStep('payment')} onBack={() => nextStep('loan-details')} />,
    },
    'payment': {
      title: 'Finalização',
      component: <Payment formData={formData} />,
    },
  };

  const stepOrder: Step[] = ['basic-info', 'loan-details', 'approval', 'payment'];
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <header className="flex items-center gap-2 mb-8">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Landmark className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800"></h1>
      </header>

      <main className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 -z-10" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 -z-10 transition-all duration-500" 
            style={{ width: `${(currentStepIndex / (stepOrder.length - 1)) * 100}%` }}
          />
          {stepOrder.map((s, idx) => (
            <div 
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                idx <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 py-4 px-6">
            <h2 className="text-white font-semibold text-lg">{steps[step].title}</h2>
          </div>
          
          <div className="p-6">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center text-center gap-4"
                >
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                    <ShieldCheck className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">Analisando Perfil...</h3>
                    <p className="text-gray-500 text-sm">Aguarde enquanto verificamos sua capacidade de crédito e geramos sua proposta.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {steps[step].component}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>&copy; 2026 - Todos os direitos reservados.</p>
        <p className="mt-1">Correspondente bancário autorizado.</p>
      </footer>
    </div>
  );
};

export default App;
