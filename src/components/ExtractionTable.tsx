import { useState } from 'react';
import { Pencil, Check, X, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExtractedField, Citation } from '@/types/extraction';
import { ConfidenceBadge } from './ConfidenceBadge';
import { CitationLink } from './CitationLink';
import { cn } from '@/lib/utils';
import { validateField, ValidationResult } from '@/data/accountData';

interface ExtractionTableProps {
  fields: ExtractedField[];
  vehicleVin: string | null;
  onFieldUpdate: (fieldName: string, newValue: string) => void;
  onFieldRevert: (fieldName: string) => void;
  onCitationClick: (citation: Citation) => void;
}

const ValidationBadge = ({ result }: { result: ValidationResult }) => {
  if (result.status === 'no_data') {
    return <span className="text-xs text-muted-foreground italic">No data</span>;
  }
  if (result.status === 'match') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Match
      </span>
    );
  }
  return (
    <div className="space-y-0.5">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
        <AlertTriangle className="h-3.5 w-3.5" />
        Mismatch
      </span>
      {result.accountValue !== null && (
        <p className="text-xs text-muted-foreground truncate max-w-[180px]" title={result.accountValue}>
          "{result.accountValue}"
        </p>
      )}
    </div>
  );
};

export const ExtractionTable = ({
  fields,
  vehicleVin,
  onFieldUpdate,
  onFieldRevert,
  onCitationClick,
}: ExtractionTableProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (field: ExtractedField) => {
    setEditingField(field.fieldName);
    setEditValue(field.extractedValue || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = (fieldName: string) => {
    onFieldUpdate(fieldName, editValue);
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead className="w-[250px] font-semibold">Field Name</TableHead>
            <TableHead className="font-semibold">Extracted Value</TableHead>
            <TableHead className="w-[180px] font-semibold">Validation</TableHead>
            <TableHead className="w-[140px] font-semibold">Confidence</TableHead>
            <TableHead className="w-[120px] font-semibold">Citation</TableHead>
            <TableHead className="w-[100px] font-semibold text-center">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field) => {
            const isEditing = editingField === field.fieldName;
            const hasLowConfidence = field.confidence < 70 && field.extractedValue !== null;
            const validation = validateField(vehicleVin, field.fieldName, field.extractedValue);

            return (
              <TableRow
                key={field.fieldName}
                className={cn(
                  'group',
                  field.isEdited && 'editable-cell-edited',
                  hasLowConfidence && !field.isEdited && 'bg-warning/5'
                )}
              >
                <TableCell className="font-medium text-foreground">
                  {field.fieldName}
                  {hasLowConfidence && !field.isEdited && (
                    <span className="ml-2 text-xs text-warning">⚠</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 max-w-md"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          field.extractedValue === null && 'text-muted-foreground italic'
                        )}
                      >
                        {field.extractedValue || 'Not Found'}
                      </span>
                      {field.isEdited && field.originalValue !== field.extractedValue && (
                        <span className="text-xs text-muted-foreground">
                          (was: {field.originalValue || 'Not Found'})
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <ValidationBadge result={validation} />
                </TableCell>
                <TableCell>
                  <ConfidenceBadge
                    confidence={field.confidence}
                    isEdited={field.isEdited}
                  />
                </TableCell>
                <TableCell>
                  <CitationLink
                    citation={field.citation}
                    onCitationClick={onCitationClick}
                  />
                </TableCell>
                <TableCell className="text-center">
                  {isEditing ? (
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-success hover:text-success hover:bg-success/10"
                        onClick={() => saveEdit(field.fieldName)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => startEditing(field)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {field.isEdited && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => onFieldRevert(field.fieldName)}
                          title="Revert to original"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
