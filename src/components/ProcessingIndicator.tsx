import { Check, Loader2 } from 'lucide-react';
import { ProcessingStep } from '@/types/extraction';
import { cn } from '@/lib/utils';

interface ProcessingIndicatorProps {
  steps: ProcessingStep[];
  currentStepIndex: number;
}

export const ProcessingIndicator = ({ steps, currentStepIndex }: ProcessingIndicatorProps) => {
  return (
    <div className="flex flex-col items-center py-12">
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center processing-pulse">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-3 transition-opacity',
              index > currentStepIndex && 'opacity-40'
            )}
          >
            <div
              className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                step.status === 'completed'
                  ? 'bg-success text-success-foreground'
                  : step.status === 'active'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {step.status === 'completed' ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                'text-sm',
                step.status === 'active'
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {step.label}
              {step.status === 'active' && '...'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
