import { FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Citation } from '@/types/extraction';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CitationLinkProps {
  citation: Citation | null;
  onCitationClick: (citation: Citation) => void;
}

export const CitationLink = ({ citation, onCitationClick }: CitationLinkProps) => {
  if (!citation) {
    return (
      <span className="text-xs text-muted-foreground italic">No citation</span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
          onClick={() => onCitationClick(citation)}
        >
          <FileSearch className="h-4 w-4 mr-1" />
          Page {citation.pageNumber}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">View source in document</p>
      </TooltipContent>
    </Tooltip>
  );
};
