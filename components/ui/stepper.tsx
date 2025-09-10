"use client";

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function Stepper({ currentStep, totalSteps, labels }: StepperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = i === totalSteps - 1;

          return (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                    isCompleted
                      ? "bg-brand text-white"
                      : isActive
                      ? "bg-brand text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {labels && labels[i] && (
                  <span
                    className={cn(
                      "ml-3 text-sm font-medium hidden sm:block",
                      isActive || isCompleted
                        ? "text-brand"
                        : "text-gray-500"
                    )}
                  >
                    {labels[i]}
                  </span>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-px mx-4 transition-colors",
                    isCompleted ? "bg-brand" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}