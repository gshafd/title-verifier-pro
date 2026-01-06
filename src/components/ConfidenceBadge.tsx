import { cn } from '@/lib/utils';
import { AlertTriangle, Check, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConfidenceBadgeProps {
  confidence: number;
  isEdited?: boolean;
  threshold?: number;
}

export const ConfidenceBadge = ({
  confidence,
  isEdited = false,
  threshold = 70,
}: ConfidenceBadgeProps) => {
  if (isEdited) {
    return (
      <span className="confidence-badge bg-primary/10 text-primary">
        <Check className="h-3 w-3" />
        User Confirmed
      </span>
    );
  }

  const getConfidenceLevel = () => {
    if (confidence >= threshold) return 'high';
    if (confidence >= threshold - 20) return 'medium';
    return 'low';
  };

  const level = getConfidenceLevel();

  const badge = (
    <span
      className={cn(
        'confidence-badge',
        level === 'high' && 'confidence-high',
        level === 'medium' && 'confidence-medium',
        level === 'low' && 'confidence-low'
      )}
    >
      {level === 'high' && <Check className="h-3 w-3" />}
      {level === 'medium' && <AlertCircle className="h-3 w-3" />}
      {level === 'low' && <AlertTriangle className="h-3 w-3" />}
      {confidence}%
    </span>
  );

  if (level !== 'high') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {level === 'low'
              ? 'Low confidence. Please review carefully.'
              : 'Moderate confidence. Consider verification.'}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return badge;
};
