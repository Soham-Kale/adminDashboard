import { cn } from "@/lib/utils/cn";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { AlertCircle } from "lucide-react";

interface ChartWrapperProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function ChartWrapper({
  title,
  description,
  isLoading,
  isError,
  isEmpty,
  action,
  children,
  className,
  height = "h-64",
}: ChartWrapperProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-5", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className={cn(height, "w-full")}>
        {isLoading && (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner label="Loading chart…" />
          </div>
        )}
        {isError && !isLoading && (
          <EmptyState
            icon={<AlertCircle className="h-6 w-6 text-destructive" />}
            title="Failed to load chart"
            description="An error occurred. Please refresh to try again."
          />
        )}
        {isEmpty && !isLoading && !isError && (
          <EmptyState title="No data available" description="There is no data to display for this chart." />
        )}
        {!isLoading && !isError && !isEmpty && children}
      </div>
    </div>
  );
}
