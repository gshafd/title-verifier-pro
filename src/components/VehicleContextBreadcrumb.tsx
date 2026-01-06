import { Link } from 'react-router-dom';
import { UploadedFile, VehicleTitle } from '@/types/extraction';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { FileText, Car, Home } from 'lucide-react';

interface VehicleContextBreadcrumbProps {
  document: UploadedFile | undefined;
  vehicle: VehicleTitle | undefined;
  vehicleIndex: number;
  showBackLink?: boolean;
}

export const VehicleContextBreadcrumb = ({
  document,
  vehicle,
  vehicleIndex,
  showBackLink = false,
}: VehicleContextBreadcrumbProps) => {
  if (!document || !vehicle) return null;

  return (
    <div className="bg-muted/50 rounded-lg px-4 py-3 border border-border">
      <Breadcrumb>
        <BreadcrumbList>
          {showBackLink && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-2 hover:text-foreground">
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Document:</span>
              <span>{document.name}</span>
            </div>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span className="font-medium">Vehicle {vehicleIndex}</span>
                <span className="text-muted-foreground">–</span>
                <code className="text-sm bg-background px-2 py-0.5 rounded border">
                  VIN ****{vehicle.vinEnding}
                </code>
              </div>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
