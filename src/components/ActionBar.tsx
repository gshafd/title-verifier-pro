import { Download, Send, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { VehicleTitle } from '@/types/extraction';
import { StateFormFiller } from './StateFormFiller';

interface ActionBarProps {
  vehicle?: VehicleTitle; // Single vehicle for detail page
  vehicles?: VehicleTitle[]; // Multiple vehicles for overview
  onSave: () => void;
  onExport: () => void;
  onPush: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export const ActionBar = ({
  vehicle,
  vehicles = [],
  onSave,
  onExport,
  onPush,
  isSaving,
  hasUnsavedChanges,
}: ActionBarProps) => {
  const [showPushDialog, setShowPushDialog] = useState(false);
  const [showFormFiller, setShowFormFiller] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  // Use single vehicle if provided, otherwise use vehicles array
  const activeVehicle = vehicle || vehicles[0];
  const allVehicles = vehicle ? [vehicle] : vehicles;

  const editedFieldsCount = allVehicles.reduce((acc, v) => {
    return acc + v.fields.filter(f => f.isEdited).length;
  }, 0);

  const handlePushClick = () => {
    if (activeVehicle) {
      // Show form filler first
      setShowFormFiller(true);
    } else {
      setShowPushDialog(true);
    }
  };

  const handleFormComplete = async () => {
    setShowFormFiller(false);
    setIsPushing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onPush();
    setIsPushing(false);
  };

  const handlePushConfirm = async () => {
    setIsPushing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onPush();
    setIsPushing(false);
    setShowPushDialog(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
        <Button
          variant="outline"
          onClick={onSave}
          disabled={isSaving || !hasUnsavedChanges}
          className="gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Review
          {hasUnsavedChanges && (
            <span className="ml-1 h-2 w-2 rounded-full bg-warning" />
          )}
        </Button>

        <Button variant="outline" onClick={onExport} className="gap-2">
          <Download className="h-4 w-4" />
          Download Excel
        </Button>

        <div className="flex-1" />

        <Button
          onClick={handlePushClick}
          disabled={hasUnsavedChanges || isPushing}
          className="gap-2"
        >
          {isPushing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Pushing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Push / Publish Data
            </>
          )}
        </Button>
      </div>

      {/* Form Filler Dialog */}
      {activeVehicle && (
        <Dialog open={showFormFiller} onOpenChange={setShowFormFiller}>
          <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Fill State Form</DialogTitle>
              <DialogDescription>
                Complete the required state form for Vehicle VIN ending {activeVehicle.vinEnding}. 
                Fields have been pre-filled from extracted data.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto min-h-0">
              <StateFormFiller
                vehicle={activeVehicle}
                onComplete={handleFormComplete}
                onCancel={() => setShowFormFiller(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Legacy Push Dialog for multiple vehicles */}
      <Dialog open={showPushDialog} onOpenChange={setShowPushDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Push / Publish Data</DialogTitle>
            <DialogDescription>
              You are about to push the reviewed vehicle title data to the downstream system.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Vehicles</p>
                  <p className="font-semibold text-foreground">{allVehicles.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Edited Fields</p>
                  <p className="font-semibold text-foreground">{editedFieldsCount}</p>
                </div>
              </div>
            </div>

            <ul className="space-y-2">
              {allVehicles.map((v, index) => (
                <li key={v.id} className="flex items-center gap-2 text-sm">
                  <span className="status-dot status-dot-success" />
                  <span>
                    Vehicle {index + 1} – VIN ending {v.vinEnding}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPushDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePushConfirm} disabled={isPushing}>
              {isPushing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Pushing...
                </>
              ) : (
                'Confirm Push'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
