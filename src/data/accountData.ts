// Simulated account/backend data for validation against extracted fields
// Keyed by VIN

export interface AccountRecord {
  vin: string;
  fields: Record<string, string | null>;
}

export const ACCOUNT_DATA: Record<string, AccountRecord> = {
  '1HGCM82633A001481': {
    vin: '1HGCM82633A001481',
    fields: {
      'VIN (Vehicle Identification Number)': '1HGCM82633A001481',
      'Year': '2024',
      'Make': 'Honda',
      'Model': 'Accord',
      'Body Style': 'Sedan',
      'Title Number': 'TN-2024-123456',
      'Title State': 'California',
      'Title Type': 'Clean',
      'Title Status': 'Active',
      'Issue Date': '01/15/2024',
      'Owner Name': 'John M. Smith', // Slightly different from extracted
      'Owner Address': '1234 Main Street, Anytown, CA 12345',
      'Co-Owner Name': null,
      'Lienholder Name': 'First National Bank',
      'Lienholder Address': 'PO Box 12345, Finance City, FC 54321',
      'Lien Date': '01/15/2024',
      'Lien Release Date': null,
      'Odometer Reading': '15,200', // Different from extracted
      'Odometer Status': 'Actual',
      'Brand/Remarks': null,
      'Previous Title Number': null,
      'Previous Title State': null,
    },
  },
  '5YJSA1DN5DFP19425': {
    vin: '5YJSA1DN5DFP19425',
    fields: {
      'VIN (Vehicle Identification Number)': '5YJSA1DN5DFP19425',
      'Year': '2023',
      'Make': 'Tesla',
      'Model': 'Model S',
      'Body Style': 'Sedan', // Different from extracted "Hatchback"
      'Title Number': 'TN-2023-789012',
      'Title State': 'Nevada',
      'Title Type': 'Clean',
      'Title Status': 'Active',
      'Issue Date': '06/20/2023',
      'Owner Name': 'Jane E. Doe', // Slightly different
      'Owner Address': '5678 Oak Avenue, Las Vegas, NV 89101',
      'Co-Owner Name': null,
      'Lienholder Name': null,
      'Lienholder Address': null,
      'Lien Date': null,
      'Lien Release Date': null,
      'Odometer Reading': '8,456',
      'Odometer Status': 'Actual',
      'Brand/Remarks': null,
      'Previous Title Number': 'TN-2022-456789',
      'Previous Title State': 'California',
    },
  },
  '2C3CDXCT8NH107782': {
    vin: '2C3CDXCT8NH107782',
    fields: {
      'VIN (Vehicle Identification Number)': '2C3CDXCT8NH107782',
      'Year': '2022',
      'Make': 'Dodge',
      'Model': 'Challenger',
      'Body Style': 'Coupe',
      'Title Number': 'TN-2022-555444',
      'Title State': 'Texas',
      'Title Type': 'Salvage', // Different from extracted "Clean"
      'Title Status': 'Active',
      'Issue Date': '03/10/2022',
      'Owner Name': 'Robert James Wilson',
      'Owner Address': '9012 Pine Road, Dallas, TX 75201',
      'Co-Owner Name': 'Sarah Ann Wilson',
      'Lienholder Name': 'Chase Auto Finance',
      'Lienholder Address': '1111 Bank Street, Houston, TX 77002', // Slightly different
      'Lien Date': '03/10/2022',
      'Lien Release Date': null,
      'Odometer Reading': '28,912',
      'Odometer Status': 'Actual',
      'Brand/Remarks': null,
      'Previous Title Number': null,
      'Previous Title State': null,
    },
  },
};

export type ValidationResult = {
  status: 'match' | 'mismatch' | 'no_data';
  accountValue: string | null;
};

export const validateField = (
  vin: string | null,
  fieldName: string,
  extractedValue: string | null
): ValidationResult => {
  if (!vin || !ACCOUNT_DATA[vin]) {
    return { status: 'no_data', accountValue: null };
  }

  const accountValue = ACCOUNT_DATA[vin].fields[fieldName] ?? null;

  // Both null = match
  if (extractedValue === null && accountValue === null) {
    return { status: 'match', accountValue };
  }

  // One null, one not = mismatch
  if (extractedValue === null || accountValue === null) {
    return { status: 'mismatch', accountValue };
  }

  // Normalize and compare
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  if (normalize(extractedValue) === normalize(accountValue)) {
    return { status: 'match', accountValue };
  }

  return { status: 'mismatch', accountValue };
};
