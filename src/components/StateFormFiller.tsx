import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { VehicleTitle, ExtractedField } from '@/types/extraction';

// State form configurations
const STATE_FORMS: Record<string, {
  name: string;
  pdfPath: string;
  fields: Array<{
    id: string;
    label: string;
    mappedField?: string; // Maps to extraction field
    type: 'text' | 'checkbox' | 'date';
    required?: boolean;
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
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Get the state from the vehicle's extracted fields
  const stateField = vehicle.fields.find(f => f.fieldName === 'Title State');
  const vehicleState = stateField?.extractedValue || 'Unknown';
  
  // Get the appropriate form configuration
  const formConfig = STATE_FORMS[vehicleState] || DEFAULT_FORM;

  // Helper to get field value from extraction
  const getExtractedValue = (fieldName: string): string => {
    const field = vehicle.fields.find(f => f.fieldName === fieldName);
    return field?.extractedValue || '';
  };

  // Initialize form with extracted data
  useEffect(() => {
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

    setFormData(initialData);
  }, [vehicle, formConfig]);

  const handleInputChange = (fieldId: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate generating filled PDF
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a simple text representation for download
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vehicleState}_Duplicate_Title_${vehicle.vinEnding}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsDownloading(false);
  };

  const generateFormContent = (): string => {
    let content = `${formConfig.name}\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `Vehicle: VIN ending ${vehicle.vinEnding}\n`;
    content += `State: ${vehicleState}\n\n`;
    content += `FORM DATA:\n`;
    content += `${'-'.repeat(30)}\n\n`;

    formConfig.fields.forEach(field => {
      const value = formData[field.id];
      if (field.type === 'checkbox') {
        content += `${field.label}: ${value ? '☑ Yes' : '☐ No'}\n`;
      } else {
        content += `${field.label}: ${value || 'Not provided'}\n`;
      }
    });

    content += `\n${'='.repeat(50)}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    
    return content;
  };

  const handlePreviewPDF = () => {
    if (formConfig.pdfPath) {
      window.open(formConfig.pdfPath, '_blank');
    }
    setShowPreview(true);
  };

  const isFormValid = () => {
    return formConfig.fields
      .filter(f => f.required)
      .every(f => {
        const value = formData[f.id];
        return value !== undefined && value !== '' && value !== false;
      });
  };

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Form Preview</h3>
          <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
            Back to Edit
          </Button>
        </div>
        
        <Card className="bg-secondary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {formConfig.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 text-sm">
                {formConfig.fields.map(field => {
                  const value = formData[field.id];
                  return (
                    <div key={field.id} className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">{field.label}</span>
                      <span className="font-medium text-foreground">
                        {field.type === 'checkbox' 
                          ? (value ? '☑ Yes' : '☐ No')
                          : (value || '—')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'Generating...' : 'Download Form'}
          </Button>
          <Button onClick={onComplete} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Complete & Push
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            State Form: {vehicleState}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formConfig.name}
        </p>
      </div>

      <ScrollArea className="h-[350px] pr-4">
        <div className="space-y-4">
          {formConfig.fields.map(field => (
            <div key={field.id}>
              {field.type === 'checkbox' ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={formData[field.id] as boolean || false}
                    onCheckedChange={(checked) => handleInputChange(field.id, checked as boolean)}
                  />
                  <Label htmlFor={field.id} className="text-sm cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor={field.id} className="text-sm">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Input
                    id={field.id}
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={formData[field.id] as string || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="h-9"
                  />
                  {field.mappedField && formData[field.id] && (
                    <p className="text-xs text-muted-foreground">
                      Auto-filled from extracted data
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-3 justify-end pt-2 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="outline" 
          onClick={handlePreviewPDF}
          disabled={!formConfig.pdfPath}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View Original Form
        </Button>
        <Button 
          onClick={() => setShowPreview(true)}
          disabled={!isFormValid()}
          className="gap-2"
        >
          Preview & Download
        </Button>
      </div>
    </div>
  );
};
