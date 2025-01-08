import React from "react";
import { Dialog, Classes, Button } from "@blueprintjs/core";

interface AggregatedValues {
  min: number;
  max: number;
  avg: number;
}

interface StatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColumnName?: string;
  aggregatedValues?: AggregatedValues;
}

// Dialog For Displaying Stats of A column
const StatsDialog: React.FC<StatsDialogProps> = ({
    isOpen,
    onClose,
    selectedColumnName,
    aggregatedValues,
    }) => {
        return (
            <Dialog isOpen={isOpen} onClose={onClose} title="Column Aggregations">
            <div className={Classes.DIALOG_BODY}>
                {aggregatedValues ? (
                <div>
                    <p>
                    <strong>Column:</strong> {selectedColumnName}
                    </p>
                    <p>
                    <strong>Min:</strong> {aggregatedValues.min}
                    </p>
                    <p>
                    <strong>Max:</strong> {aggregatedValues.max}
                    </p>
                    <p>
                    <strong>Avg:</strong> {aggregatedValues.avg.toFixed(2)}
                    </p>
                </div>
                ) : (
                <p>No data available for this column.</p>
                )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <Button intent="primary" onClick={onClose}>
                Close
                </Button>
            </div>
            </Dialog>
        );
    };

export default StatsDialog;