import { UploadedFile, VehicleTitle } from '@/types/extraction';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { FileText, Car } from 'lucide-react';

interface VehicleContextBreadcrumbProps {
  document: UploadedFile | undefined;
  vehicle: VehicleTitle | undefined;
  vehicleIndex: number;
}

export const VehicleContextBreadcrumb = ({
  document,
  vehicle,
  vehicleIndex,
}: VehicleContextBreadcrumbProps) => {
  if (!document || !vehicle) return null;

  return (
    <div className="bg-muted/50 rounded-lg px-4 py-3 border border-border">
      <Breadcrumb>
        <BreadcrumbList>
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
