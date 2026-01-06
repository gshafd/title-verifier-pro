import { FileText, Car, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ExtractionResult } from '@/types/extraction';
import { cn } from '@/lib/utils';

interface ExtractionSummaryProps {
  result: ExtractionResult;
}

export const ExtractionSummary = ({ result }: ExtractionSummaryProps) => {
  const lowConfidenceCount = result.vehicleTitles.reduce((acc, title) => {
    return acc + title.fields.filter(f => f.confidence < 70 && f.extractedValue !== null).length;
  }, 0);

  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      label: 'Extraction Completed',
      className: 'text-success',
    },
    completed_with_warnings: {
      icon: AlertTriangle,
      label: 'Completed with Low-Confidence Fields',
      className: 'text-warning',
    },
    error: {
      icon: AlertTriangle,
      label: 'Extraction Error',
      className: 'text-destructive',
    },
    processing: {
      icon: Clock,
      label: 'Processing',
      className: 'text-muted-foreground',
    },
  };

  const status = statusConfig[result.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon className={cn('h-6 w-6', status.className)} />
          <div>
            <h2 className="text-lg font-semibold text-foreground">{status.label}</h2>
            <p className="text-sm text-muted-foreground">
              Extracted at {result.extractedAt.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Documents</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{result.documents.length}</p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Car className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Vehicles Detected</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{result.vehicleTitles.length}</p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Low Confidence</span>
          </div>
          <p className={cn(
            'text-2xl font-semibold',
            lowConfidenceCount > 0 ? 'text-warning' : 'text-foreground'
          )}>
            {lowConfidenceCount}
          </p>
        </div>
      </div>
    </div>
  );
};
