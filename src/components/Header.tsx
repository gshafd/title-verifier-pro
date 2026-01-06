import { FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showSettings?: boolean;
}

export const Header = ({ showSettings = true }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Vehicle Title Extraction</h1>
              <p className="text-sm text-muted-foreground">FDRYZE Document Analysis for accurate title data</p>
            </div>
          </div>
          
          {showSettings && (
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
