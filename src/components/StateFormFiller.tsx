import { useState, useEffect } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { VehicleTitle } from '@/types/extraction';

// State form configurations with PDF field mappings
const STATE_FORMS: Record<string, {
  name: string;
  pdfPath: string;
  fields: Array<{
    id: string;
    label: string;
    mappedField?: string;
    type: 'text' | 'checkbox' | 'date';
    required?: boolean;
    pdfFieldName?: string; // Actual PDF form field name if different
  }>;
}> = {
  'California': {
    name: 'California Application for Duplicate Title (REG 227)',
    pdfPath: '/forms/california-duplicate-title.pdf',
    fields: [
      { id: 'vehicleLicensePlate', label: 'Vehicle License Plate or Vessel CF Number', type: 'text' },
      { id: 'vin', label: 'Vehicle/Hull Identification Number', mappedField: 'VIN (Vehicle Identification Number)', type: 'text', required: true },
      { id: 'yearMake', label: 'Year/Make of Vehicle', type: 'text' },
      { id: 'ownerName', label: 'True Full Name (Last, First, Middle, Suffix)', mappedField: 'Owner Name', type: 'text', required: true },
      { id: 'driverLicense', label: 'Driver License/ID Card Number', type: 'text' },
      { id: 'dlState', label: 'State', type: 'text' },
      { id: 'coOwnerName', label: 'Co-Owner True Full Name', mappedField: 'Co-Owner Name', type: 'text' },
      { id: 'coOwnerDL', label: 'Co-Owner Driver License/ID Card Number', type: 'text' },
      { id: 'physicalAddress', label: 'Physical Residence or Business Address', mappedField: 'Owner Address', type: 'text', required: true },
      { id: 'city', label: 'City', type: 'text', required: true },
      { id: 'state', label: 'State', type: 'text', required: true },
      { id: 'zipCode', label: 'ZIP Code', type: 'text', required: true },
      { id: 'county', label: 'County of Residence', type: 'text' },
      { id: 'mailingAddress', label: 'Mailing Address (if different)', type: 'text' },
      { id: 'lienholderName', label: 'Legal Owner (Bank, Finance Company)', mappedField: 'Lienholder Name', type: 'text' },
      { id: 'lienholderAddress', label: 'Lienholder Business Address', mappedField: 'Lienholder Address', type: 'text' },
      { id: 'reasonLost', label: 'Title is Lost', type: 'checkbox' },
      { id: 'reasonStolen', label: 'Title is Stolen', type: 'checkbox' },
      { id: 'reasonMutilated', label: 'Title is Illegible/Mutilated', type: 'checkbox' },
      { id: 'reasonNotReceived', label: 'Not Received from Prior Owner', type: 'checkbox' },
      { id: 'signatureDate', label: 'Date', type: 'date', required: true },
      { id: 'daytimePhone', label: 'Daytime Telephone Number', type: 'text' },
    ],
  },
  'Arizona': {
    name: 'Arizona Title and Registration Application (96-0236)',
    pdfPath: '/forms/arizona-duplicate-title.pdf',
    fields: [
      { id: 'vin', label: 'Vehicle Identification Number', mappedField: 'VIN (Vehicle Identification Number)', type: 'text', required: true },
      { id: 'make', label: 'Make', mappedField: 'Make', type: 'text', required: true },
      { id: 'model', label: 'Model', mappedField: 'Model', type: 'text' },
      { id: 'year', label: 'Year', mappedField: 'Year', type: 'text', required: true },
      { id: 'bodyStyle', label: 'Body Style', mappedField: 'Body Style', type: 'text' },
      { id: 'plateNumber', label: 'Plate Number', type: 'text' },
      { id: 'odometer', label: 'Odometer Reading', mappedField: 'Odometer Reading', type: 'text' },
      { id: 'lienholderName', label: 'Lienholder Name', mappedField: 'Lienholder Name', type: 'text' },
      { id: 'lienDate', label: 'Lien Date', mappedField: 'Lien Date', type: 'date' },
      { id: 'ownerName', label: 'Owner/Company Name', mappedField: 'Owner Name', type: 'text', required: true },
      { id: 'driverLicense', label: 'Driver License or EIN', type: 'text' },
      { id: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      { id: 'residentialAddress', label: 'Residential/Business Address', mappedField: 'Owner Address', type: 'text', required: true },
      { id: 'city', label: 'City', type: 'text', required: true },
      { id: 'state', label: 'State', type: 'text', required: true },
      { id: 'zip', label: 'ZIP', type: 'text', required: true },
      { id: 'county', label: 'County', type: 'text' },
      { id: 'mailingAddress', label: 'Mailing Address (if different)', type: 'text' },
      { id: 'phoneNumber', label: 'Phone Number', type: 'text' },
      { id: 'email', label: 'Email Address', type: 'text' },
      { id: 'duplicateTitle', label: 'Duplicate Title', type: 'checkbox' },
    ],
  },
  'Michigan': {
    name: 'Michigan Out-of-State Resident Duplicate Title Application',
    pdfPath: '/forms/michigan-duplicate-title.pdf',
    fields: [
      { id: 'vehicleYear', label: 'Vehicle Year', mappedField: 'Year', type: 'text', required: true },
      { id: 'make', label: 'Make', mappedField: 'Make', type: 'text', required: true },
      { id: 'plateNumber', label: 'Plate Number', type: 'text' },
      { id: 'vin', label: 'Vehicle Identification Number (VIN)', mappedField: 'VIN (Vehicle Identification Number)', type: 'text', required: true },
      { id: 'ownerName', label: 'Owner Name (First, Middle, Last)', mappedField: 'Owner Name', type: 'text', required: true },
      { id: 'streetAddress', label: 'Street Address (Michigan Residence)', type: 'text' },
      { id: 'apartment', label: 'Apartment, Lot, or Suite #', type: 'text' },
      { id: 'city', label: 'City', type: 'text', required: true },
      { id: 'state', label: 'State', type: 'text', required: true },
      { id: 'zip', label: 'ZIP', type: 'text', required: true },
      { id: 'daytimePhone', label: 'Daytime Telephone Number', type: 'text' },
      { id: 'faxNumber', label: 'Fax Number', type: 'text' },
      { id: 'outOfStateAddress', label: 'Out-of-State Mailing Address', mappedField: 'Owner Address', type: 'text' },
      { id: 'reasonLost', label: 'Lost', type: 'checkbox' },
      { id: 'reasonStolen', label: 'Stolen', type: 'checkbox' },
      { id: 'reasonMutilated', label: 'Mutilated', type: 'checkbox' },
      { id: 'firstSecuredParty', label: 'First Secured Party', mappedField: 'Lienholder Name', type: 'text' },
      { id: 'filingDate', label: 'Filing Date', mappedField: 'Lien Date', type: 'date' },
      { id: 'signatureDate', label: 'Date', type: 'date', required: true },
    ],
  },
};

// Default form for unsupported states
const DEFAULT_FORM = {
  name: 'Generic Duplicate Title Application',
  pdfPath: '',
  fields: [
    { id: 'vin', label: 'Vehicle Identification Number (VIN)', mappedField: 'VIN (Vehicle Identification Number)', type: 'text' as const, required: true },
    { id: 'year', label: 'Year', mappedField: 'Year', type: 'text' as const, required: true },
    { id: 'make', label: 'Make', mappedField: 'Make', type: 'text' as const, required: true },
    { id: 'model', label: 'Model', mappedField: 'Model', type: 'text' as const },
    { id: 'ownerName', label: 'Owner Name', mappedField: 'Owner Name', type: 'text' as const, required: true },
    { id: 'ownerAddress', label: 'Owner Address', mappedField: 'Owner Address', type: 'text' as const },
    { id: 'lienholderName', label: 'Lienholder Name', mappedField: 'Lienholder Name', type: 'text' as const },
  ],
};

interface StateFormFillerProps {
  vehicle: VehicleTitle;
  onComplete: () => void;
  onCancel: () => void;
}

export const StateFormFiller = ({ vehicle, onComplete, onCancel }: StateFormFillerProps) => {
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the state from the vehicle's extracted fields
  const stateField = vehicle.fields.find(f => f.fieldName === 'Title State');
  const vehicleState = stateField?.extractedValue || 'Unknown';
  
  // Get the appropriate form configuration - fallback to California if state not supported
  const formConfig = STATE_FORMS[vehicleState] || STATE_FORMS['California'];

  // Helper to get field value from extraction
  const getExtractedValue = (fieldName: string): string => {
    const field = vehicle.fields.find(f => f.fieldName === fieldName);
    return field?.extractedValue || '';
  };

  // Initialize form data from extracted values
  const initializeFormData = () => {
    const initialData: Record<string, string | boolean> = {};
    
    formConfig.fields.forEach(field => {
      if (field.mappedField) {
        initialData[field.id] = getExtractedValue(field.mappedField);
      } else if (field.type === 'checkbox') {
        initialData[field.id] = false;
      } else {
        initialData[field.id] = '';
      }
    });

    // Special handling for combined fields
    if (vehicleState === 'California') {
      const year = getExtractedValue('Year');
      const make = getExtractedValue('Make');
      initialData['yearMake'] = `${year} ${make}`.trim();
    }

    return initialData;
  };

  // Generate filled PDF using pdf-lib
  const generateFilledPDF = async (data: Record<string, string | boolean>): Promise<Uint8Array> => {
    // If no PDF template available, create a new document
    if (!formConfig.pdfPath) {
      return await createNewFilledPDF(data);
    }

    try {
      // Try to load the original PDF template
      const response = await fetch(formConfig.pdfPath);
      if (!response.ok) {
        console.warn('PDF template not found, creating new document');
        return await createNewFilledPDF(data);
      }
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
      
      // Try to fill form fields if they exist
      try {
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        // If the PDF has form fields, try to fill them
        if (fields.length > 0) {
          formConfig.fields.forEach(fieldConfig => {
            const value = data[fieldConfig.id];
            if (value !== undefined && value !== '') {
              try {
                if (fieldConfig.type === 'checkbox') {
                  const checkbox = form.getCheckBox(fieldConfig.pdfFieldName || fieldConfig.id);
                  if (value) checkbox.check();
                } else {
                  const textField = form.getTextField(fieldConfig.pdfFieldName || fieldConfig.id);
                  textField.setText(String(value));
                }
              } catch {
                // Field not found, will use overlay method
              }
            }
          });
          form.flatten();
        }
      } catch {
        // No form fields or error, continue with overlay
      }

      // Add an overlay page with all the filled data
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Add a semi-transparent overlay with filled data at the bottom
      let yPosition = 120;
      const fontSize = 8;
      const lineHeight = 12;

      // Draw a white background box for the data overlay
      firstPage.drawRectangle({
        x: 20,
        y: 10,
        width: width - 40,
        height: 110,
        color: rgb(1, 1, 1),
        opacity: 0.9,
      });

      // Draw border
      firstPage.drawRectangle({
        x: 20,
        y: 10,
        width: width - 40,
        height: 110,
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 0.5,
      });

      // Title
      firstPage.drawText('FILLED DATA SUMMARY', {
        x: 30,
        y: yPosition - 5,
        size: 9,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      yPosition -= lineHeight + 5;

      // Draw filled data in columns
      const col1X = 30;
      const col2X = width / 2 + 10;
      let currentCol = 1;
      let col1Y = yPosition;
      let col2Y = yPosition;

      formConfig.fields.forEach((field) => {
        const value = data[field.id];
        if (value !== undefined && value !== '' && value !== false) {
          const displayValue = field.type === 'checkbox' ? '☑' : String(value);
          const text = `${field.label}: ${displayValue}`;
          const truncatedText = text.length > 50 ? text.substring(0, 47) + '...' : text;

          if (currentCol === 1 && col1Y > 25) {
            firstPage.drawText(truncatedText, {
              x: col1X,
              y: col1Y,
              size: fontSize,
              font: font,
              color: rgb(0.2, 0.2, 0.2),
            });
            col1Y -= lineHeight;
            currentCol = 2;
          } else if (col2Y > 25) {
            firstPage.drawText(truncatedText, {
              x: col2X,
              y: col2Y,
              size: fontSize,
              font: font,
              color: rgb(0.2, 0.2, 0.2),
            });
            col2Y -= lineHeight;
            currentCol = 1;
          }
        }
      });

      return await pdfDoc.save();
    } catch (error) {
      console.error('Error loading PDF template, creating new document:', error);
      // Fallback: Create a new PDF document with the form data
      return await createNewFilledPDF(data);
    }
  };

  // Create a new PDF with form data (fallback)
  const createNewFilledPDF = async (data: Record<string, string | boolean>): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { height } = page.getSize();

    let yPosition = height - 50;
    const fontSize = 10;
    const lineHeight = 18;
    const margin = 50;

    // Title
    page.drawText(formConfig.name, {
      x: margin,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    // Vehicle Info
    page.drawText(`Vehicle: VIN ending ${vehicle.vinEnding}`, {
      x: margin,
      y: yPosition,
      size: 11,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= 15;

    page.drawText(`State: ${vehicleState}`, {
      x: margin,
      y: yPosition,
      size: 11,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= 30;

    // Separator line
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: 562, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    yPosition -= 20;

    // Form Fields
    formConfig.fields.forEach((field) => {
      if (yPosition < 50) {
        // Add new page if needed
        return;
      }

      const value = data[field.id];
      let displayValue: string;

      if (field.type === 'checkbox') {
        displayValue = value ? '☑ Yes' : '☐ No';
      } else {
        displayValue = String(value || '—');
      }

      // Field label
      page.drawText(`${field.label}:`, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Field value
      page.drawText(displayValue, {
        x: margin + 250,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });

      yPosition -= lineHeight;
    });

    // Footer
    yPosition = 30;
    page.drawText(`Generated: ${new Date().toLocaleString()}`, {
      x: margin,
      y: yPosition,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    return await pdfDoc.save();
  };

  // Initialize and generate PDF preview immediately on mount
  useEffect(() => {
    const generatePreview = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = initializeFormData();
        setFormData(data);
        
        const pdfBytes = await generateFilledPDF(data);
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (err) {
        console.error('Error generating PDF:', err);
        setError('Failed to generate PDF preview');
      }
      
      setIsLoading(false);
    };

    generatePreview();
  }, [vehicle]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const pdfBytes = await generateFilledPDF(formData);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${vehicleState}_Duplicate_Title_${vehicle.vinEnding}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
    
    setIsDownloading(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Generating filled form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <FileText className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* PDF Preview - Takes full height */}
      <div className="flex-1 min-h-0 bg-muted">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full"
            title="Filled PDF Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No preview available</p>
          </div>
        )}
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="flex gap-3 justify-end p-4 border-t border-border bg-background">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDownload}
          disabled={isDownloading || !previewUrl}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </Button>
        <Button onClick={onComplete} className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Complete
        </Button>
      </div>
    </div>
  );
};
