import { useState, useCallback } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface ConfirmDialogOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'default';
}

interface ConfirmDialogState extends ConfirmDialogOptions {
    isOpen: boolean;
    resolve?: (value: boolean) => void;
}

export function useConfirmDialog() {
    const [dialogState, setDialogState] = useState<ConfirmDialogState>({
        isOpen: false,
        title: 'Are you sure?',
        description: 'This action cannot be undone.',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'danger',
    });

    const confirm = useCallback((options?: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                title: options?.title || 'Are you sure?',
                description: options?.description || 'This action cannot be undone.',
                confirmText: options?.confirmText || 'Confirm',
                cancelText: options?.cancelText || 'Cancel',
                variant: options?.variant || 'danger',
                resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        dialogState.resolve?.(true);
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    }, [dialogState.resolve]);

    const handleCancel = useCallback(() => {
        dialogState.resolve?.(false);
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    }, [dialogState.resolve]);

    const getConfirmButtonClass = () => {
        switch (dialogState.variant) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            case 'warning':
                return 'bg-orange-600 hover:bg-orange-700 text-white';
            default:
                return 'bg-primary hover:bg-primary/90';
        }
    };

    const ConfirmDialog = () => (
        <AlertDialog open={dialogState.isOpen} onOpenChange={handleCancel}>
            <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900 dark:text-white">
                        {dialogState.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        {dialogState.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={handleCancel}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                    >
                        {dialogState.cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={getConfirmButtonClass()}
                    >
                        {dialogState.confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return { confirm, ConfirmDialog };
}
