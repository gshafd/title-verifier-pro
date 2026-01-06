import { VehicleTitle } from '@/types/extraction';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleSelectorProps {
  vehicles: VehicleTitle[];
  selectedVehicleId: string;
  onSelectVehicle: (vehicleId: string) => void;
}

export const VehicleSelector = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: VehicleSelectorProps) => {
  if (vehicles.length <= 1) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Select Vehicle Title
      </h3>
      <Tabs value={selectedVehicleId} onValueChange={onSelectVehicle}>
        <TabsList className="h-auto p-1 bg-secondary/50">
          {vehicles.map((vehicle, index) => {
            const hasWarnings = vehicle.fields.some(
              f => f.confidence < 70 && f.extractedValue !== null
            );
            
            return (
              <TabsTrigger
                key={vehicle.id}
                value={vehicle.id}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-card',
                  hasWarnings && 'text-warning'
                )}
              >
                <Car className="h-4 w-4" />
                <span>Vehicle {index + 1}</span>
                <span className="text-xs text-muted-foreground">
                  – VIN ending {vehicle.vinEnding}
                </span>
                {hasWarnings && (
                  <AlertTriangle className="h-3.5 w-3.5 ml-1" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};
