import { useState } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Citation } from '@/types/extraction';
import { cn } from '@/lib/utils';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  citation: Citation | null;
  documentUrl?: string;
  totalPages: number;
}

export const DocumentViewer = ({
  isOpen,
  onClose,
  citation,
  documentUrl,
  totalPages,
}: DocumentViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(citation?.pageNumber || 1);

  if (!isOpen) return null;

  const getHighlightStyle = () => {
    if (!citation) return {};
    
    return {
      left: `${citation.boundingBox.x}%`,
      top: `${citation.boundingBox.y}%`,
      width: `${citation.boundingBox.width}%`,
      height: `${citation.boundingBox.height}%`,
    };
  };

  // Determine highlight color based on confidence (would normally come from props)
  const highlightClass = 'highlight-box highlight-box-high';

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 bg-card rounded-xl border border-border shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-foreground">Document Viewer</h3>
            {citation && (
              <span className="text-sm text-muted-foreground">
                Showing citation on page {citation.pageNumber}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Document content */}
        <div className="flex-1 overflow-auto p-6 bg-secondary/20">
          <div
            className="relative mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            style={{
              width: `${zoom}%`,
              maxWidth: '100%',
              minHeight: '800px',
            }}
          >
            {/* Placeholder document representation */}
            <div className="aspect-[8.5/11] bg-white relative">
              {/* Mock document content */}
              <div className="p-8 space-y-4">
                <div className="text-center border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-bold text-gray-800">CERTIFICATE OF TITLE</h2>
                  <p className="text-sm text-gray-600">State of [State Name]</p>
                </div>
                
                <div className="space-y-6 text-sm text-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Title Number</p>
                      <p className="font-medium">TN-2024-123456</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Issue Date</p>
                      <p className="font-medium">01/15/2024</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">Vehicle Identification Number (VIN)</p>
                    <p className="font-mono font-medium text-lg">1HGCM82633A001481</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Year</p>
                      <p className="font-medium">2024</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Make</p>
                      <p className="font-medium">Honda</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Model</p>
                      <p className="font-medium">Accord</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">Owner Name</p>
                    <p className="font-medium">John Michael Smith</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">Owner Address</p>
                    <p className="font-medium">1234 Main Street, Anytown, ST 12345</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 uppercase">Lienholder</p>
                    <p className="font-medium">First National Bank</p>
                    <p className="text-sm text-gray-600">PO Box 12345, Finance City, FC 54321</p>
                  </div>
                </div>
              </div>

              {/* Citation highlight box */}
              {citation && currentPage === citation.pageNumber && (
                <div
                  className={cn('highlight-box', highlightClass)}
                  style={getHighlightStyle()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
