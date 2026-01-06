import { Header } from '@/components/Header';
import { UploadDropzone } from '@/components/UploadDropzone';
import { ProcessingIndicator } from '@/components/ProcessingIndicator';
import { VehicleSelector } from '@/components/VehicleSelector';
import { ExtractionTable } from '@/components/ExtractionTable';
import { ActionBar } from '@/components/ActionBar';
import { DocumentViewer } from '@/components/DocumentViewer';
import { useExtraction } from '@/hooks/useExtraction';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const {
    files,
    isProcessing,
    processingSteps,
    currentStepIndex,
    extractionResult,
    selectedVehicleId,
    hasUnsavedChanges,
    viewerOpen,
    activeCitation,
    addFiles,
    removeFile,
    startExtraction,
    updateField,
    revertField,
    saveReview,
    exportToExcel,
    pushToDownstream,
    openCitation,
    closeCitation,
    setSelectedVehicleId,
    resetExtraction,
  } = useExtraction();

  const selectedVehicle = extractionResult?.vehicleTitles.find(
    (v) => v.id === selectedVehicleId
  );

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

              {/* Vehicle Selector */}
              <VehicleSelector
                vehicles={extractionResult.vehicleTitles}
                selectedVehicleId={selectedVehicleId || ''}
                onSelectVehicle={setSelectedVehicleId}
              />

              {/* Extraction Table */}
              {selectedVehicle && (
                <ExtractionTable
                  fields={selectedVehicle.fields}
                  onFieldUpdate={(fieldName, newValue) =>
                    updateField(selectedVehicle.id, fieldName, newValue)
                  }
                  onFieldRevert={(fieldName) =>
                    revertField(selectedVehicle.id, fieldName)
                  }
                  onCitationClick={openCitation}
                />
              )}

              {/* Action Bar */}
              <ActionBar
                vehicles={extractionResult.vehicleTitles}
                onSave={saveReview}
                onExport={exportToExcel}
                onPush={pushToDownstream}
                isSaving={false}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>
          )}
        </div>
      </main>

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={viewerOpen}
        onClose={closeCitation}
        citation={activeCitation}
        totalPages={files[0]?.pageCount || 1}
      />
    </div>
  );
};

export default Index;
