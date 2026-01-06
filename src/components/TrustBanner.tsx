import { ShieldCheck } from 'lucide-react';

export const TrustBanner = () => {
  return (
    <div className="trust-banner">
      <ShieldCheck className="h-4 w-4 flex-shrink-0" />
      <span>
        All values shown are extracted directly from uploaded documents. No synthetic or placeholder data is generated.
      </span>
    </div>
  );
};
