import React from "react";
import Button from "./Button";
import { AlertCircle } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Records Available",
  message = "There are currently no items matching your criteria in this section.",
  actionText,
  actionHref,
  onActionClick,
  className = "",
}) => {
  return (
    <div
      className={`border-2 border-dashed border-slate-200 bg-white/60 rounded-xl p-8 sm:p-12 text-center max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-ariiti-navy">{title}</h3>
      <p className="mt-2 text-sm text-ariiti-muted leading-relaxed max-w-md mx-auto">
        {message}
      </p>
      {(actionText && (actionHref || onActionClick)) && (
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            href={actionHref}
            onClick={onActionClick}
          >
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
