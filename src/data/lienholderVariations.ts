// Acceptable variations database for lienholder names
// Each entry has a canonical name and its known variations

export interface LienholderEntry {
  canonical: string;
  variations: string[];
}

export const LIENHOLDER_VARIATIONS: LienholderEntry[] = [
  {
    canonical: 'First National Bank',
    variations: [
      'First National Bank',
      'First Natl Bank',
      'FNB',
      'First National Banking Corp',
      'First National Bank & Trust',
    ],
  },
  {
    canonical: 'Chase Auto Finance',
    variations: [
      'Chase Auto Finance',
      'Chase Auto',
      'JPMorgan Chase Auto Finance',
      'JP Morgan Chase Auto',
      'Chase Bank Auto Lending',
      'Chase',
    ],
  },
  {
    canonical: 'Ally Financial',
    variations: [
      'Ally Financial',
      'Ally Auto',
      'Ally Bank',
      'Ally Financial Inc',
      'GMAC (now Ally)',
    ],
  },
  {
    canonical: 'Capital One Auto Finance',
    variations: [
      'Capital One Auto Finance',
      'Capital One Auto',
      'Cap One Auto',
      'Capital One Bank Auto',
      'Capital One, N.A.',
    ],
  },
  {
    canonical: 'Wells Fargo Dealer Services',
    variations: [
      'Wells Fargo Dealer Services',
      'Wells Fargo Auto',
      'Wells Fargo Bank Auto',
      'WF Dealer Services',
      'Wells Fargo & Company Auto',
    ],
  },
  {
    canonical: 'Bank of America',
    variations: [
      'Bank of America',
      'BofA Auto',
      'Bank of America Auto Loans',
      'BOA',
      'Bank of America, N.A.',
    ],
  },
];

export type LienholderValidationResult = {
  status: 'match' | 'mismatch' | 'no_data';
  matchedCanonical: string | null;
};

export const validateLienholderName = (
  extractedName: string | null
): LienholderValidationResult => {
  if (!extractedName) {
    return { status: 'no_data', matchedCanonical: null };
  }

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  const normalizedExtracted = normalize(extractedName);

  for (const entry of LIENHOLDER_VARIATIONS) {
    for (const variation of entry.variations) {
      if (normalize(variation) === normalizedExtracted) {
        return { status: 'match', matchedCanonical: entry.canonical };
      }
    }
  }

  return { status: 'mismatch', matchedCanonical: null };
};
