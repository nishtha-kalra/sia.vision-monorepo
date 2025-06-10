"use client";
import React, { useState } from 'react';
import { Asset } from './types';

interface OnboardingFlowProps {
  onCreateAsset: (assetType: Asset['type']) => void;
  onSkip: () => void;
}

interface OnboardingStepProps {
  step: number;
  currentStep: number;
  title: string;
  description: string;
  icon: string;
  action?: () => void;
  actionLabel?: string;
  isCompleted?: boolean;
}

const OnboardingStep = ({ 
  step, 
  currentStep, 
  title, 
  description, 
  icon, 
  action, 
  actionLabel,
  isCompleted = false 
}: OnboardingStepProps) => {
  const isActive = step === currentStep;
  const isPast = step < currentStep;

  return (
    <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
      isActive 
        ? 'border-[#6366F1] bg-gradient-to-br from-[#6366F1]/5 to-[#8B5CF6]/5 shadow-lg' 
        : isPast
        ? 'border-[#10B981] bg-[#10B981]/5'
        : 'border-[#E5E7EB] bg-white'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isCompleted || isPast
            ? 'bg-[#10B981] text-white'
            : isActive 
            ? 'bg-[#6366F1] text-white shadow-lg' 
            : 'bg-[#F3F4F6] text-[#6B7280]'
        }`}>
          {isCompleted || isPast ? '✓' : icon}
          {isActive && (
            <div className="absolute inset-0 rounded-xl bg-[#6366F1] animate-ping opacity-20"></div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-[#6B7280]">Step {step}</span>
            {isActive && <span className="text-xs text-[#6366F1] font-medium">Current</span>}
            {(isCompleted || isPast) && <span className="text-xs text-[#10B981] font-medium">Complete</span>}
          </div>
          <h3 className={`font-semibold text-lg mb-2 ${
            isActive ? 'text-[#6366F1]' : isPast ? 'text-[#10B981]' : 'text-[#111827]'
          }`}>
            {title}
          </h3>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{description}</p>
          
          {isActive && action && actionLabel && (
            <button
              onClick={action}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5B5BD6] transition-all duration-200 font-medium text-sm"
            >
              {actionLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const OnboardingFlow = ({ onCreateAsset, onSkip }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    if (step < 4) {
      setCurrentStep(step + 1);
    }
  };

  const handleCreateCharacter = () => {
    onCreateAsset('CHARACTER');
    completeStep(1);
  };

  const handleCreateStory = () => {
    onCreateAsset('STORYLINE');
    completeStep(2);
  };

  const handleCreateLore = () => {
    onCreateAsset('LORE');
    completeStep(3);
  };

  const handlePublish = () => {
    completeStep(4);
    // This would trigger the publish flow
  };

  const steps = [
    {
      step: 1,
      title: "Create Your First Character",
      description: "Start with a character - the heart of any great story. Define their traits, background, and motivations.",
      icon: "👤",
      action: handleCreateCharacter,
      actionLabel: "Create Character",
    },
    {
      step: 2,
      title: "Write Your Opening Scene",
      description: "Bring your character to life with a story. Use our rich text editor to craft compelling narratives.",
      icon: "📖",
      action: handleCreateStory,
      actionLabel: "Start Writing",
    },
    {
      step: 3,
      title: "Build Your World",
      description: "Define the lore and rules of your universe. Create the foundation that supports your stories.",
      icon: "🌍",
      action: handleCreateLore,
      actionLabel: "Define Lore",
    },
    {
      step: 4,
      title: "Protect & Share",
      description: "Register your creations on-chain to establish ownership and share them with the community.",
      icon: "🔒",
      action: handlePublish,
      actionLabel: "Publish Assets",
    }
  ];

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Welcome to SIA</h2>
            <p className="text-[#6B7280]">Let's create your first storyworld together</p>
          </div>
          <button
            onClick={onSkip}
            className="text-[#6B7280] hover:text-[#111827] text-sm transition-colors"
          >
            Skip tour
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-[#6B7280] mb-2">
            <span>Your Progress</span>
            <span>{completedSteps.length} of {steps.length} complete</span>
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-[#6366F1] to-[#10B981] h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step) => (
          <OnboardingStep
            key={step.step}
            currentStep={currentStep}
            isCompleted={completedSteps.includes(step.step)}
            {...step}
          />
        ))}
      </div>

      {/* Bottom Section */}
      {completedSteps.length === steps.length && (
        <div className="mt-8 p-6 bg-gradient-to-r from-[#10B981]/10 to-[#6366F1]/10 rounded-2xl border border-[#10B981]/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#10B981] to-[#6366F1] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-[#6B7280] mb-4">
              You've created your first storyworld. Now explore advanced features like collaborative editing, 
              AI-assisted creation, and programmable IP protection.
            </p>
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl hover:from-[#5B5BD6] hover:to-[#7C3AED] transition-all duration-200 font-medium"
            >
              Explore Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center text-white text-sm">
            💡
          </div>
          <div>
            <h4 className="font-medium text-[#111827] mb-1">Need help?</h4>
            <p className="text-sm text-[#6B7280] mb-2">
              Each asset you create becomes part of your intellectual property portfolio. 
              You can always come back to edit, expand, or publish your work later.
            </p>
            <button className="text-[#6366F1] hover:text-[#5B5BD6] text-sm font-medium transition-colors">
              Learn more about IP protection →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 