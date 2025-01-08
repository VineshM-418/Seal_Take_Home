import React from "react";
import { Dialog, Classes, InputGroup, Button } from "@blueprintjs/core";

interface EquationDialogProps {
  isOpen: boolean;
  equation: string;
  onEquationChange: (value: string) => void;
  onClose: () => void;
  onAddColumn: () => void;
}

// Dialog For Taking Equation from User to make a new Column

const EquationDialog: React.FC<EquationDialogProps> = ({
  isOpen,
  equation,
  onEquationChange,
  onClose,
  onAddColumn,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Enter Equation">
      <div className={Classes.DIALOG_BODY}>
        <InputGroup
          placeholder="Enter equation (e.g., c1 * c2)"
          value={equation}
          onChange={(e) => onEquationChange(e.target.value)}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onAddColumn} intent="primary">
            Add Column
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default EquationDialog;