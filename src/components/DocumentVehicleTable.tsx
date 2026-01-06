import { useNavigate } from 'react-router-dom';
import { VehicleTitle, UploadedFile } from '@/types/extraction';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from 'lucide-react';

interface DocumentVehicleTableProps {
  documents: UploadedFile[];
  vehicles: VehicleTitle[];
}

export const DocumentVehicleTable = ({
  documents,
  vehicles,
}: DocumentVehicleTableProps) => {
  const navigate = useNavigate();
  // Create rows: one per vehicle, with document info
  const rows = vehicles.map((vehicle) => {
    const document = documents.find((d) => d.id === vehicle.sourceDocumentId);
    const vehicleIndexInDoc = vehicles
      .filter((v) => v.sourceDocumentId === vehicle.sourceDocumentId)
      .findIndex((v) => v.id === vehicle.id) + 1;

    return {
      vehicleId: vehicle.id,
      documentName: document?.name || 'Unknown Document',
      pageCount: document?.pageCount || 0,
      vehicleLabel: `Vehicle ${vehicleIndexInDoc}`,
      vinMasked: `****${vehicle.vinEnding}`,
    };
  });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Document & Vehicle Overview
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {documents.length} document{documents.length !== 1 ? 's' : ''} · {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} detected
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px]">Document Name</TableHead>
            <TableHead className="w-[80px] text-center">Pages</TableHead>
            <TableHead className="w-[120px]">Vehicle</TableHead>
            <TableHead className="w-[120px]">VIN (Masked)</TableHead>
            <TableHead className="w-[150px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.vehicleId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium truncate">{row.documentName}</span>
                </div>
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {row.pageCount}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {row.vehicleLabel}
              </TableCell>
              <TableCell>
                <code className="text-sm bg-muted px-2 py-0.5 rounded">
                  {row.vinMasked}
                </code>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/vehicle/${row.vehicleId}`)}
                  className="gap-2"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View vehicle info
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
