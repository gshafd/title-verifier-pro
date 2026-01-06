export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  previewUrl?: string;
}

export interface Citation {
  pageNumber: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedField {
  fieldName: string;
  extractedValue: string | null;
  confidence: number;
  citation: Citation | null;
  isEdited: boolean;
  originalValue: string | null;
  editedBy?: string;
  editedAt?: Date;
}

export interface VehicleTitle {
  id: string;
  vinEnding: string;
  fullVin: string | null;
  sourceDocumentId: string;
  fields: ExtractedField[];
  status: 'completed' | 'completed_with_warnings' | 'error';
}

export interface ExtractionResult {
  id: string;
  documents: UploadedFile[];
  vehicleTitles: VehicleTitle[];
  extractedAt: Date;
  status: 'processing' | 'completed' | 'completed_with_warnings' | 'error';
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

// Predefined title fields
export const TITLE_FIELDS = [
  'VIN (Vehicle Identification Number)',
  'Year',
  'Make',
  'Model',
  'Body Style',
  'Title Number',
  'Title State',
  'Title Type',
  'Title Status',
  'Issue Date',
  'Owner Name',
  'Owner Address',
  'Co-Owner Name',
  'Lienholder Name',
  'Lienholder Address',
  'Lien Date',
  'Lien Release Date',
  'Odometer Reading',
  'Odometer Status',
  'Brand/Remarks',
  'Previous Title Number',
  'Previous Title State',
] as const;

export type TitleFieldName = typeof TITLE_FIELDS[number];
