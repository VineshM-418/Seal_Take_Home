import { Button, Dialog, Classes, InputGroup, Intent } from '@blueprintjs/core';
import React, { useState } from 'react';
import './App.css';
import OpviaTable from './OpviaTable';
import EqnDialog from './EqnDialog';
import ErrorDialog from './ErrorDialog';
import { dummyTableData as initialDummyTableData } from './data/dummyData';

const App: React.FC = () => {

  // Props for Handling New Column
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [equation, setEquation] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  
  const [columns, setColumns] = useState([
    { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
    { columnName: 'Cell Density (Cell Count/Litre)', columnType: 'data', columnId: 'var_col_1' },
    { columnName: 'Volume (Litres)', columnType: 'data', columnId: 'var_col_2' },
  ]);
  const [dummyTableData, setDummyTableData] = useState(initialDummyTableData);

  const numRows = Math.max(
        ...Object.keys(dummyTableData)
          .map((key) => parseInt(key.split('-')[1], 10)) // Extract the row index from keys
          .filter((rowIndex) => !isNaN(rowIndex)) // Ensure it's a valid number
      ) + 1;

  const extractColumnReferences = (equation: string): string[] => {
    const regex = /c\d+/g; // Matches column identifiers like c1, c2, etc.
    return equation.match(regex) || [];
  };

  const parseAndEvaluateEquation = (
    equation: string,
    data: { [key: string]: number },
    rowIndex: number
    ): number => {
      const columnMapping: { [key: string]: { value: number; type: string } } = {};
    
      // Populate columnMapping with available columns and their types
      columns.forEach((col, index) => {
        const value = data[`${index}-${rowIndex}`];
        const type = col.columnType;
        columnMapping[`c${index + 1}`] = { value, type };
      });
    
      const columnTypes = new Set<string>();
    
      // Replace column references in the equation
      const replacedEquation = equation.replace(/c\d+/g, (match) => {
        const column = columnMapping[match];
    
        // Check if the referenced column exists
        if (!column) {
          throw new Error(`Referenced column "${match}" does not exist.`);
        }
    
        const { value, type } = column;
        columnTypes.add(type);
    
        return value.toString();
      });
    
      // Check for data type mismatches
      if (columnTypes.size > 1) {
        throw new Error("Data type mismatch in the equation.");
      }
    
      console.log(`Evaluating equation for row ${rowIndex}: ${replacedEquation}`);
    
      try {
        // Use Function constructor to safely evaluate the expression
        const result = new Function(`return ${replacedEquation}`)();
    
        return result;
      } catch (error) {
        console.error("Error evaluating equation:", error, `Equation: ${replacedEquation}`);
        throw new Error("Error evaluating the equation. Please check the syntax.");
      }
  };

  const handleAddColumn = () => {
    try {
      const newColumnId = `var_col_${columns.length + 1}`;
      const newColumn = { columnName: equation, columnType: 'data', columnId: newColumnId };
    
      const newTableData = { ...dummyTableData };
    
      for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const result = parseAndEvaluateEquation(equation, dummyTableData, rowIndex);
    
        // Check if result is NaN
        if (isNaN(result)) {
          throw new Error("Error in equation evaluation resulting in NaN");
        }
    
        // Check if result is Infinity
        if (!isFinite(result)) {
          throw new Error("Error in equation evaluation resulting in an infinite value");
        }
    
        newTableData[`${columns.length}-${rowIndex}`] = result.toFixed(2);
      }
    
    
      setColumns([...columns, newColumn]);
      setDummyTableData(newTableData);
      setEquation("")
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setIsErrorDialogOpen(true);
    }
  };

  return (
    <div className="App">
      
      <div style={{ padding: 30 }}>
        <Button onClick={() => setIsDialogOpen(true)}  >Add Column</Button>
        <div style={{ paddingBottom: 30 }} ></div>
        <EqnDialog
          isOpen={isDialogOpen}
          equation={equation}
          onEquationChange={setEquation}
          onClose={() => setIsDialogOpen(false)}
          onAddColumn={handleAddColumn}
        />
       <ErrorDialog
          isOpen={isErrorDialogOpen}
          errorMessage={errorMessage}
          onClose={() => setIsErrorDialogOpen(false)}
       />
        <OpviaTable columns={columns} dummyTableData={dummyTableData} />
      </div>
    </div>
  );
};

export default App;
