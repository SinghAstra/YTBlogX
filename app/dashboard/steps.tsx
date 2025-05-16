"use client";

import { CheckCircle2 } from "lucide-react";

interface StepsProps {
  currentStep: number;
}

export function Steps({ currentStep }: StepsProps) {
  const steps = [
    { id: 1, name: "Video Info" },
    { id: 2, name: "Get Transcript" },
    { id: 3, name: "Process" },
    { id: 4, name: "Results" },
  ];

  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={`relative flex-1 ${
                stepIdx !== steps.length - 1 ? "pr-8" : ""
              }`}
            >
              {step.id < currentStep ? (
                <div className="group">
                  <span className="flex items-center">
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <CheckCircle2
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-3 text-sm font-medium">
                      {step.name}
                    </span>
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ) : step.id === currentStep ? (
                <div className="group" aria-current="step">
                  <span className="flex items-center">
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </span>
                    <span className="ml-3 text-sm font-medium">
                      {step.name}
                    </span>
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ) : (
                <div className="group">
                  <span className="flex items-center">
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
