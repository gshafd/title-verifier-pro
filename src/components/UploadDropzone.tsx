import { useCallback, useState } from 'react';
import { Upload, FileText, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadedFile } from '@/types/extraction';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  files: UploadedFile[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="h-5 w-5 text-destructive" />;
  return <File className="h-5 w-5 text-primary" />;
};

export const UploadDropzone = ({
  files,
  onFilesAdd,
  onFileRemove,
  onSubmit,
  isSubmitting,
}: UploadDropzoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'tif'].includes(ext || '');
    });
    
    if (droppedFiles.length > 0) {
      onFilesAdd(droppedFiles);
    }
  }, [onFilesAdd]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFilesAdd(selectedFiles);
    }
    e.target.value = '';
  }, [onFilesAdd]);

  return (
    <div className="space-y-6">
      <div
        className={cn('upload-dropzone', isDragActive && 'upload-dropzone-active')}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
          className="hidden"
          onChange={handleFileInput}
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              'h-16 w-16 rounded-full flex items-center justify-center transition-colors',
              isDragActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            )}>
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? 'Drop files here' : 'Drag & drop documents'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse • PDF, JPG, PNG, TIFF
              </p>
            </div>
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">
              Uploaded Documents ({files.length})
            </h3>
          </div>
          
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border animate-slide-up"
              >
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                    {file.pageCount !== null && ` • ${file.pageCount} page${file.pageCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onFileRemove(file.id)}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-4"
            size="lg"
            onClick={onSubmit}
            disabled={isSubmitting || files.length === 0}
          >
            {isSubmitting ? 'Processing...' : 'Submit for Extraction'}
          </Button>
        </div>
      )}
    </div>
  );
};
