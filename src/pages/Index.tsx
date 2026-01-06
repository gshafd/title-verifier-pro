import { Header } from '@/components/Header';
import { UploadDropzone } from '@/components/UploadDropzone';
import { ProcessingIndicator } from '@/components/ProcessingIndicator';
import { DocumentVehicleTable } from '@/components/DocumentVehicleTable';
import { useExtractionContext } from '@/contexts/ExtractionContext';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const {
    files,
    isProcessing,
    processingSteps,
    currentStepIndex,
    extractionResult,
    addFiles,
    removeFile,
    startExtraction,
    resetExtraction,
  } = useExtractionContext();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Upload Phase */}
          {!extractionResult && !isProcessing && (
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Title Data Extraction & Verification
                  </h2>
                  <p className="text-muted-foreground">
                    Transform unstructured title documents into reviewable, structured data with full source traceability and audit support.
                  </p>
                </div>

                <UploadDropzone
                  files={files}
                  onFilesAdd={addFiles}
                  onFileRemove={removeFile}
                  onSubmit={startExtraction}
                  isSubmitting={isProcessing}
                />
              </div>
            </div>
          )}

          {/* Processing Phase */}
          {isProcessing && (
            <div className="bg-card rounded-xl border border-border p-8">
              <ProcessingIndicator
                steps={processingSteps}
                currentStepIndex={currentStepIndex}
              />
            </div>
          )}

          {/* Results Phase */}
          {extractionResult && !isProcessing && (
            <div className="space-y-6 animate-fade-in">
              {/* Header with New Extraction button */}
              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  onClick={resetExtraction}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  New Extraction
                </Button>
              </div>

              {/* Document & Vehicle Overview Table */}
              <DocumentVehicleTable
                documents={extractionResult.documents}
                vehicles={extractionResult.vehicleTitles}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
