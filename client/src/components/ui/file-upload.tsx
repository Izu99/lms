import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    accept?: string;
    maxSizeMB?: number;
    label?: string;
    description?: string;
    className?: string;
    disabled?: boolean;
}

export function FileUpload({
    onFileSelect,
    accept = "application/pdf",
    maxSizeMB = 10,
    label = "Upload File",
    description = "Drag and drop your file here, or click to browse",
    className,
    disabled = false
}: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const validateFile = (file: File): boolean => {
        // Check file type
        if (accept && accept !== "*") {
            const acceptedTypes = accept.split(',').map(t => t.trim());
            const fileType = file.type;
            const fileName = file.name.toLowerCase();

            const isValidType = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileName.endsWith(type.toLowerCase());
                }
                if (type.endsWith('/*')) {
                    const mainType = type.replace('/*', '');
                    return fileType.startsWith(mainType);
                }
                return fileType === type;
            });

            if (!isValidType) {
                setError(`Invalid file type. Accepted types: ${accept}`);
                return false;
            }
        }

        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size exceeds ${maxSizeMB}MB limit.`);
            return false;
        }

        setError(null);
        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                onFileSelect(droppedFile);
            }
        }
    }, [disabled, maxSizeMB, accept, onFileSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                onFileSelect(selectedFile);
            }
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        onFileSelect(null);
        setError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const onButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center cursor-pointer",
                    dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/50",
                    error ? "border-destructive/50 bg-destructive/5" : "",
                    disabled ? "opacity-60 cursor-not-allowed hover:border-border hover:bg-transparent" : "",
                    file ? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                    disabled={disabled}
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                    {file ? (
                        <>
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-semibold text-foreground break-all px-4">
                                    {file.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Ready to upload
                                </div>
                                {!disabled && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                                        onClick={removeFile}
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                                dragActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                                error ? "bg-destructive/10 text-destructive" : ""
                            )}>
                                {error ? (
                                    <AlertCircle className="w-8 h-8" />
                                ) : (
                                    <Upload className="w-8 h-8" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg font-semibold text-foreground">
                                    {label}
                                </p>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    {error || description}
                                </p>
                            </div>
                            <div className="pt-2">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium bg-muted px-2 py-1 rounded">
                                    {accept === "application/pdf" ? "PDF" : accept.replace("image/", "").toUpperCase()} • Max {maxSizeMB}MB
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
