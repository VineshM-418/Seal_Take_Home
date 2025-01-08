import React from "react";
import { Dialog, Classes, Button } from "@blueprintjs/core";

interface ErrorDialogProps {
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
}

// Dialog For Displaying Error in Making a New Column

const ErrorDialog: React.FC<ErrorDialogProps> = ({ isOpen, errorMessage, onClose }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Error">
      <div className={Classes.DIALOG_BODY}>{errorMessage}</div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onClose} intent="primary">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ErrorDialog;