import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};
