import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { VehicleContextBreadcrumb } from '@/components/VehicleContextBreadcrumb';
import { ExtractionTable } from '@/components/ExtractionTable';
import { ActionBar } from '@/components/ActionBar';
import { DocumentViewer } from '@/components/DocumentViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useExtractionContext } from '@/contexts/ExtractionContext';

const VehicleDetail = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const {
    files,
    extractionResult,
    hasUnsavedChanges,
    viewerOpen,
    activeCitation,
    updateField,
    revertField,
    saveReview,
    exportToExcel,
    pushToDownstream,
    openCitation,
    closeCitation,
  } = useExtractionContext();

  const selectedVehicle = extractionResult?.vehicleTitles.find(
    (v) => v.id === vehicleId
  );

  const selectedDocument = extractionResult?.documents.find(
    (d) => d.id === selectedVehicle?.sourceDocumentId
  );

  // Calculate vehicle index within its document
  const vehicleIndexInDoc = selectedVehicle
    ? extractionResult?.vehicleTitles
        .filter((v) => v.sourceDocumentId === selectedVehicle.sourceDocumentId)
        .findIndex((v) => v.id === selectedVehicle.id) + 1
    : 0;

  // Redirect if no extraction result or vehicle not found
  if (!extractionResult || !selectedVehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">Vehicle not found or no extraction data available.</p>
            <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-6 animate-fade-in">
          {/* Context Breadcrumb with back navigation */}
          <VehicleContextBreadcrumb
            document={selectedDocument}
            vehicle={selectedVehicle}
            vehicleIndex={vehicleIndexInDoc || 1}
            showBackLink
          />

          {/* Extraction Table */}
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

          {/* Action Bar */}
          <ActionBar
            vehicle={selectedVehicle}
            onSave={saveReview}
            onExport={exportToExcel}
            onPush={pushToDownstream}
            isSaving={false}
            hasUnsavedChanges={hasUnsavedChanges}
          />
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

export default VehicleDetail;
