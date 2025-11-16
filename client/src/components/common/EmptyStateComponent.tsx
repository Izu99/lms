import React from 'react';

interface EmptyStateComponentProps {
  Icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    Icon?: React.ElementType;
  };
}

export const EmptyStateComponent: React.FC<EmptyStateComponentProps> = ({ Icon, title, description, action }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-12 text-center">
      <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {action.Icon && <action.Icon className="w-5 h-5" />}
          {action.label}
        </button>
      )}
    </div>
  );
};
