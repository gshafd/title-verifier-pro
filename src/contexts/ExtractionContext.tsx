import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  UploadedFile,
  ExtractionResult,
  VehicleTitle,
  ProcessingStep,
  TITLE_FIELDS,
  Citation,
} from '@/types/extraction';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// Helper to generate fields for a vehicle
const generateVehicleFields = (
  vehicleId: string,
  vehicleData: Record<string, { value: string | null; confidence: number; page: number }>
) => {
  return TITLE_FIELDS.map((fieldName, index) => {
    const fieldData = vehicleData[fieldName] || { value: null, confidence: 0, page: 1 };
    const hasCitation = fieldData.value !== null;

    return {
      fieldName,
      extractedValue: fieldData.value,
      confidence: fieldData.confidence,
      citation: hasCitation
        ? {
            vehicleId,
            pageNumber: fieldData.page,
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
  });
};

// Simulated extraction
const simulateExtraction = async (
  files: UploadedFile[]
): Promise<ExtractionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const vehicleTitles: VehicleTitle[] = [];
  const doc1Id = files[0]?.id || 'doc1';
  const doc2Id = files[1]?.id || 'doc2';

  // Vehicle 1
  const vehicle1Data: Record<string, { value: string | null; confidence: number; page: number }> = {
    'VIN (Vehicle Identification Number)': { value: '1HGCM82633A001481', confidence: 98, page: 1 },
    'Year': { value: '2024', confidence: 95, page: 1 },
    'Make': { value: 'Honda', confidence: 92, page: 1 },
    'Model': { value: 'Accord', confidence: 91, page: 1 },
    'Body Style': { value: 'Sedan', confidence: 88, page: 1 },
    'Title Number': { value: 'TN-2024-123456', confidence: 96, page: 1 },
    'Title State': { value: 'California', confidence: 94, page: 1 },
    'Title Type': { value: 'Clean', confidence: 89, page: 1 },
    'Title Status': { value: 'Active', confidence: 87, page: 1 },
    'Issue Date': { value: '01/15/2024', confidence: 93, page: 1 },
    'Owner Name': { value: 'John Michael Smith', confidence: 85, page: 1 },
    'Owner Address': { value: '1234 Main Street, Anytown, CA 12345', confidence: 78, page: 1 },
    'Co-Owner Name': { value: null, confidence: 0, page: 1 },
    'Lienholder Name': { value: 'First National Bank', confidence: 82, page: 1 },
    'Lienholder Address': { value: 'PO Box 12345, Finance City, FC 54321', confidence: 65, page: 1 },
    'Lien Date': { value: '01/15/2024', confidence: 79, page: 1 },
    'Lien Release Date': { value: null, confidence: 0, page: 1 },
    'Odometer Reading': { value: '15,234', confidence: 72, page: 1 },
    'Odometer Status': { value: 'Actual', confidence: 68, page: 1 },
    'Brand/Remarks': { value: null, confidence: 0, page: 1 },
    'Previous Title Number': { value: null, confidence: 0, page: 1 },
    'Previous Title State': { value: null, confidence: 0, page: 1 },
  };

  vehicleTitles.push({
    id: 'v1',
    vinEnding: '1481',
    fullVin: '1HGCM82633A001481',
    sourceDocumentId: doc1Id,
    status: 'completed_with_warnings',
    fields: generateVehicleFields('v1', vehicle1Data),
  });

  // Vehicle 2
  const vehicle2Data: Record<string, { value: string | null; confidence: number; page: number }> = {
    'VIN (Vehicle Identification Number)': { value: '5YJSA1DN5DFP19425', confidence: 97, page: 2 },
    'Year': { value: '2023', confidence: 94, page: 2 },
    'Make': { value: 'Tesla', confidence: 96, page: 2 },
    'Model': { value: 'Model S', confidence: 95, page: 2 },
    'Body Style': { value: 'Hatchback', confidence: 91, page: 2 },
    'Title Number': { value: 'TN-2023-789012', confidence: 93, page: 2 },
    'Title State': { value: 'Nevada', confidence: 92, page: 2 },
    'Title Type': { value: 'Clean', confidence: 90, page: 2 },
    'Title Status': { value: 'Active', confidence: 89, page: 2 },
    'Issue Date': { value: '06/20/2023', confidence: 94, page: 2 },
    'Owner Name': { value: 'Jane Elizabeth Doe', confidence: 88, page: 2 },
    'Owner Address': { value: '5678 Oak Avenue, Las Vegas, NV 89101', confidence: 85, page: 2 },
    'Co-Owner Name': { value: null, confidence: 0, page: 2 },
    'Lienholder Name': { value: null, confidence: 0, page: 2 },
    'Lienholder Address': { value: null, confidence: 0, page: 2 },
    'Lien Date': { value: null, confidence: 0, page: 2 },
    'Lien Release Date': { value: null, confidence: 0, page: 2 },
    'Odometer Reading': { value: '8,456', confidence: 86, page: 2 },
    'Odometer Status': { value: 'Actual', confidence: 84, page: 2 },
    'Brand/Remarks': { value: null, confidence: 0, page: 2 },
    'Previous Title Number': { value: 'TN-2022-456789', confidence: 75, page: 2 },
    'Previous Title State': { value: 'California', confidence: 73, page: 2 },
  };

  vehicleTitles.push({
    id: 'v2',
    vinEnding: '9425',
    fullVin: '5YJSA1DN5DFP19425',
    sourceDocumentId: doc1Id,
    status: 'completed',
    fields: generateVehicleFields('v2', vehicle2Data),
  });

  // Vehicle 3
  const vehicle3Data: Record<string, { value: string | null; confidence: number; page: number }> = {
    'VIN (Vehicle Identification Number)': { value: '2C3CDXCT8NH107782', confidence: 96, page: 1 },
    'Year': { value: '2022', confidence: 93, page: 1 },
    'Make': { value: 'Dodge', confidence: 95, page: 1 },
    'Model': { value: 'Challenger', confidence: 94, page: 1 },
    'Body Style': { value: 'Coupe', confidence: 90, page: 1 },
    'Title Number': { value: 'TN-2022-555444', confidence: 92, page: 1 },
    'Title State': { value: 'Texas', confidence: 91, page: 1 },
    'Title Type': { value: 'Clean', confidence: 88, page: 1 },
    'Title Status': { value: 'Active', confidence: 86, page: 1 },
    'Issue Date': { value: '03/10/2022', confidence: 91, page: 1 },
    'Owner Name': { value: 'Robert James Wilson', confidence: 87, page: 1 },
    'Owner Address': { value: '9012 Pine Road, Dallas, TX 75201', confidence: 82, page: 1 },
    'Co-Owner Name': { value: 'Sarah Ann Wilson', confidence: 80, page: 1 },
    'Lienholder Name': { value: 'Chase Auto Finance', confidence: 84, page: 1 },
    'Lienholder Address': { value: '1111 Bank Street, Houston, TX 77001', confidence: 79, page: 1 },
    'Lien Date': { value: '03/10/2022', confidence: 83, page: 1 },
    'Lien Release Date': { value: null, confidence: 0, page: 1 },
    'Odometer Reading': { value: '28,912', confidence: 85, page: 1 },
    'Odometer Status': { value: 'Actual', confidence: 81, page: 1 },
    'Brand/Remarks': { value: null, confidence: 0, page: 1 },
    'Previous Title Number': { value: null, confidence: 0, page: 1 },
    'Previous Title State': { value: null, confidence: 0, page: 1 },
  };

  vehicleTitles.push({
    id: 'v3',
    vinEnding: '7782',
    fullVin: '2C3CDXCT8NH107782',
    sourceDocumentId: doc2Id,
    status: 'completed',
    fields: generateVehicleFields('v3', vehicle3Data),
  });

  const updatedFiles = [...files];
  if (files.length === 1) {
    updatedFiles.push({
      id: doc2Id,
      file: files[0].file,
      name: 'dealer_2.pdf',
      size: 245000,
      pageCount: 5,
      status: 'completed',
    });
  }

  const hasWarnings = vehicleTitles.some(
    (v) => v.fields.some((f) => f.confidence < 70 && f.extractedValue !== null)
  );

  return {
    id: `extraction-${Date.now()}`,
    documents: updatedFiles,
    vehicleTitles,
    extractedAt: new Date(),
    status: hasWarnings ? 'completed_with_warnings' : 'completed',
  };
};

interface ExtractionContextType {
  files: UploadedFile[];
  isProcessing: boolean;
  processingSteps: ProcessingStep[];
  currentStepIndex: number;
  extractionResult: ExtractionResult | null;
  hasUnsavedChanges: boolean;
  viewerOpen: boolean;
  activeCitation: Citation | null;
  addFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  startExtraction: () => Promise<void>;
  updateField: (vehicleId: string, fieldName: string, newValue: string) => void;
  revertField: (vehicleId: string, fieldName: string) => void;
  saveReview: () => Promise<void>;
  exportToExcel: () => void;
  pushToDownstream: () => void;
  openCitation: (citation: Citation) => void;
  closeCitation: () => void;
  resetExtraction: () => void;
}

const ExtractionContext = createContext<ExtractionContextType | null>(null);

export const ExtractionProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
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

    const workbook = XLSX.utils.book_new();

    extractionResult.vehicleTitles.forEach((vehicle, index) => {
      const sheetData = vehicle.fields.map((field) => ({
        'Field Name': field.fieldName,
        'Extracted Value': field.extractedValue || 'Not Found',
        'Confidence': field.extractedValue ? `${field.confidence}%` : 'N/A',
        'Status': field.isEdited ? 'Edited' : 'Original',
        'Page': field.citation?.pageNumber || 'N/A',
      }));

      const worksheet = XLSX.utils.json_to_sheet(sheetData);

      worksheet['!cols'] = [
        { wch: 30 },
        { wch: 40 },
        { wch: 12 },
        { wch: 10 },
        { wch: 8 },
      ];

      const sheetName = `Vehicle_${index + 1}_VIN_${vehicle.vinEnding}`;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Vehicle_Titles_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);

    toast.success('Excel file downloaded', {
      description: `${extractionResult.vehicleTitles.length} vehicle sheet(s) exported`,
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
    setHasUnsavedChanges(false);
    setProcessingSteps([]);
    setCurrentStepIndex(0);
  }, []);

  return (
    <ExtractionContext.Provider
      value={{
        files,
        isProcessing,
        processingSteps,
        currentStepIndex,
        extractionResult,
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
        resetExtraction,
      }}
    >
      {children}
    </ExtractionContext.Provider>
  );
};

export const useExtractionContext = () => {
  const context = useContext(ExtractionContext);
  if (!context) {
    throw new Error('useExtractionContext must be used within ExtractionProvider');
  }
  return context;
};
