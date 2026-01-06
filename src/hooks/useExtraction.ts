import { useState, useCallback } from 'react';
import {
  UploadedFile,
  ExtractionResult,
  VehicleTitle,
  ProcessingStep,
  TITLE_FIELDS,
  Citation,
} from '@/types/extraction';
import { toast } from 'sonner';

// Simulated extraction that would normally come from AI/ML backend
const simulateExtraction = async (
  files: UploadedFile[]
): Promise<ExtractionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Generate sample vehicle titles based on uploaded documents
  const vehicleTitles: VehicleTitle[] = [
    {
      id: 'v1',
      vinEnding: '1481',
      fullVin: '1HGCM82633A001481',
      sourceDocumentId: files[0]?.id || 'doc1',
      status: 'completed_with_warnings',
      fields: TITLE_FIELDS.map((fieldName, index) => {
        // Simulate extracted values - some found, some not
        const extractedValues: Record<string, { value: string | null; confidence: number }> = {
          'VIN (Vehicle Identification Number)': { value: '1HGCM82633A001481', confidence: 98 },
          'Year': { value: '2024', confidence: 95 },
          'Make': { value: 'Honda', confidence: 92 },
          'Model': { value: 'Accord', confidence: 91 },
          'Body Style': { value: 'Sedan', confidence: 88 },
          'Title Number': { value: 'TN-2024-123456', confidence: 96 },
          'Title State': { value: 'California', confidence: 94 },
          'Title Type': { value: 'Clean', confidence: 89 },
          'Title Status': { value: 'Active', confidence: 87 },
          'Issue Date': { value: '01/15/2024', confidence: 93 },
          'Owner Name': { value: 'John Michael Smith', confidence: 85 },
          'Owner Address': { value: '1234 Main Street, Anytown, CA 12345', confidence: 78 },
          'Co-Owner Name': { value: null, confidence: 0 },
          'Lienholder Name': { value: 'First National Bank', confidence: 82 },
          'Lienholder Address': { value: 'PO Box 12345, Finance City, FC 54321', confidence: 65 },
          'Lien Date': { value: '01/15/2024', confidence: 79 },
          'Lien Release Date': { value: null, confidence: 0 },
          'Odometer Reading': { value: '15,234', confidence: 72 },
          'Odometer Status': { value: 'Actual', confidence: 68 },
          'Brand/Remarks': { value: null, confidence: 0 },
          'Previous Title Number': { value: null, confidence: 0 },
          'Previous Title State': { value: null, confidence: 0 },
        };

        const fieldData = extractedValues[fieldName] || { value: null, confidence: 0 };
        const hasCitation = fieldData.value !== null;

        return {
          fieldName,
          extractedValue: fieldData.value,
          confidence: fieldData.confidence,
          citation: hasCitation
            ? {
                pageNumber: 1,
                boundingBox: {
                  x: 10 + (index % 4) * 20,
                  y: 15 + Math.floor(index / 4) * 8,
                  width: 35,
                  height: 5,
                },
              }
            : null,
          isEdited: false,
          originalValue: fieldData.value,
        };
      }),
    },
  ];

  // Add second vehicle if multiple documents
  if (files.length > 1) {
    vehicleTitles.push({
      id: 'v2',
      vinEnding: '9425',
      fullVin: '5YJSA1DN5DFP19425',
      sourceDocumentId: files[1]?.id || 'doc2',
      status: 'completed',
      fields: TITLE_FIELDS.map((fieldName, index) => {
        const extractedValues: Record<string, { value: string | null; confidence: number }> = {
          'VIN (Vehicle Identification Number)': { value: '5YJSA1DN5DFP19425', confidence: 97 },
          'Year': { value: '2023', confidence: 94 },
          'Make': { value: 'Tesla', confidence: 96 },
          'Model': { value: 'Model S', confidence: 95 },
          'Body Style': { value: 'Hatchback', confidence: 91 },
          'Title Number': { value: 'TN-2023-789012', confidence: 93 },
          'Title State': { value: 'Nevada', confidence: 92 },
          'Title Type': { value: 'Clean', confidence: 90 },
          'Title Status': { value: 'Active', confidence: 89 },
          'Issue Date': { value: '06/20/2023', confidence: 94 },
          'Owner Name': { value: 'Jane Elizabeth Doe', confidence: 88 },
          'Owner Address': { value: '5678 Oak Avenue, Las Vegas, NV 89101', confidence: 85 },
          'Co-Owner Name': { value: null, confidence: 0 },
          'Lienholder Name': { value: null, confidence: 0 },
          'Lienholder Address': { value: null, confidence: 0 },
          'Lien Date': { value: null, confidence: 0 },
          'Lien Release Date': { value: null, confidence: 0 },
          'Odometer Reading': { value: '8,456', confidence: 86 },
          'Odometer Status': { value: 'Actual', confidence: 84 },
          'Brand/Remarks': { value: null, confidence: 0 },
          'Previous Title Number': { value: 'TN-2022-456789', confidence: 75 },
          'Previous Title State': { value: 'California', confidence: 73 },
        };

        const fieldData = extractedValues[fieldName] || { value: null, confidence: 0 };
        const hasCitation = fieldData.value !== null;

        return {
          fieldName,
          extractedValue: fieldData.value,
          confidence: fieldData.confidence,
          citation: hasCitation
            ? {
                pageNumber: 1,
                boundingBox: {
                  x: 10 + (index % 4) * 20,
                  y: 15 + Math.floor(index / 4) * 8,
                  width: 35,
                  height: 5,
                },
              }
            : null,
          isEdited: false,
          originalValue: fieldData.value,
        };
      }),
    });
  }

  const hasWarnings = vehicleTitles.some(
    (v) => v.fields.some((f) => f.confidence < 70 && f.extractedValue !== null)
  );

  return {
    id: `extraction-${Date.now()}`,
    documents: files,
    vehicleTitles,
    extractedAt: new Date(),
    status: hasWarnings ? 'completed_with_warnings' : 'completed',
  };
};

export const useExtraction = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      pageCount: file.type === 'application/pdf' ? Math.floor(Math.random() * 5) + 1 : 1,
      status: 'pending' as const,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const startExtraction = useCallback(async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProcessingSteps([
      { id: 'analyze', label: 'Analyzing documents', status: 'active' },
      { id: 'extract', label: 'Extracting title data', status: 'pending' },
      { id: 'validate', label: 'Validating fields', status: 'pending' },
    ]);
    setCurrentStepIndex(0);

    // Simulate processing steps
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setProcessingSteps((prev) =>
      prev.map((s, i) =>
        i === 0 ? { ...s, status: 'completed' } : i === 1 ? { ...s, status: 'active' } : s
      )
    );
    setCurrentStepIndex(1);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setProcessingSteps((prev) =>
      prev.map((s, i) =>
        i === 1 ? { ...s, status: 'completed' } : i === 2 ? { ...s, status: 'active' } : s
      )
    );
    setCurrentStepIndex(2);

    const result = await simulateExtraction(files);

    setProcessingSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
    setExtractionResult(result);
    setSelectedVehicleId(result.vehicleTitles[0]?.id || null);
    setIsProcessing(false);

    toast.success('Extraction completed', {
      description: `Found ${result.vehicleTitles.length} vehicle title(s)`,
    });
  }, [files]);

  const updateField = useCallback(
    (vehicleId: string, fieldName: string, newValue: string) => {
      setExtractionResult((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          vehicleTitles: prev.vehicleTitles.map((v) => {
            if (v.id !== vehicleId) return v;

            return {
              ...v,
              fields: v.fields.map((f) => {
                if (f.fieldName !== fieldName) return f;

                return {
                  ...f,
                  extractedValue: newValue || null,
                  isEdited: true,
                  editedAt: new Date(),
                };
              }),
            };
          }),
        };
      });

      setHasUnsavedChanges(true);
    },
    []
  );

  const revertField = useCallback((vehicleId: string, fieldName: string) => {
    setExtractionResult((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        vehicleTitles: prev.vehicleTitles.map((v) => {
          if (v.id !== vehicleId) return v;

          return {
            ...v,
            fields: v.fields.map((f) => {
              if (f.fieldName !== fieldName) return f;

              return {
                ...f,
                extractedValue: f.originalValue,
                isEdited: false,
                editedAt: undefined,
              };
            }),
          };
        }),
      };
    });

    setHasUnsavedChanges(true);
  }, []);

  const saveReview = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setHasUnsavedChanges(false);
    toast.success('Review saved successfully');
  }, []);

  const exportToExcel = useCallback(() => {
    if (!extractionResult) return;

    // In a real app, this would generate an actual Excel file
    toast.success('Excel file downloaded', {
      description: `vehicle_titles_${new Date().toISOString().split('T')[0]}.xlsx`,
    });
  }, [extractionResult]);

  const pushToDownstream = useCallback(() => {
    toast.success('Data pushed successfully', {
      description: 'All vehicle titles have been sent to the downstream system.',
    });
  }, []);

  const openCitation = useCallback((citation: Citation) => {
    setActiveCitation(citation);
    setViewerOpen(true);
  }, []);

  const closeCitation = useCallback(() => {
    setViewerOpen(false);
    setActiveCitation(null);
  }, []);

  const resetExtraction = useCallback(() => {
    setFiles([]);
    setExtractionResult(null);
    setSelectedVehicleId(null);
    setHasUnsavedChanges(false);
    setProcessingSteps([]);
    setCurrentStepIndex(0);
  }, []);

  return {
    // State
    files,
    isProcessing,
    processingSteps,
    currentStepIndex,
    extractionResult,
    selectedVehicleId,
    hasUnsavedChanges,
    viewerOpen,
    activeCitation,

    // Actions
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
  };
};
