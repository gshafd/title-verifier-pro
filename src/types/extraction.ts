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
  vehicleId: string;
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
  'License Plate',
  'Asset Description',
  'Title Number',
  'Title State',
  'Title Type',
  'Title Status',
  'Issue Date',
  'Owner First Name',
  'Owner Last Name',
  'Owner Address 1',
  'Owner Address 2',
  'Owner City',
  'Owner State',
  'Owner Zipcode',
  'Co-Owner First Name',
  'Co-Owner Last Name',
  'Lienholder Name',
  'Lienholder Address 1',
  'Lienholder Address 2',
  'Lienholder City',
  'Lienholder State',
  'Lienholder Zipcode',
  'Lien Date',
  'Lien Release Date',
  'Odometer Reading',
  'Odometer Status',
  'Brand',
  'Previous Title Number',
  'Previous Title State',
] as const;

export type TitleFieldName = typeof TITLE_FIELDS[number];
